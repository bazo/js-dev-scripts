/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LintResults } from "@bazo/js-dev-scripts-types";
import chalk from "chalk";
import cpy from "cpy";
import del from "del";
import * as esbuild from "esbuild";
import figures from "figures";
import * as fs from "fs";
import makeDir from "make-dir";
import * as nunjucks from "nunjucks";
import ora from "ora";
import * as path from "path";
import prettyBytes from "pretty-bytes";
import revHash from "rev-hash";
//@ts-ignore
import revPath from "rev-path";
import * as vm from "vm";

import {
	DevScriptsConfig,
	envVarsDefinitionsToTemplateVars,
	findPublicHTMLFileForEntryPoint,
	getEnvVarsDefinitions,
	loadConfig,
} from "../lib/config";
import { prefix, processLintResult, processTscLintResult } from "../lib/functions";
import { gzip } from "../lib/gzip";
import { lintFile, tscLint } from "../lib/lint";
import { BuiltFilesReport } from "../lib/types";

process.env.NODE_ENV = "production";

const cwd = process.cwd();

const config = loadConfig();

const { srcFolder, buildFolder, publicFolder } = config;

const envVarsDefinitions = {
	"process.env.NODE_ENV": '"production"',
	...getEnvVarsDefinitions(),
};

function resolveInjects(config: DevScriptsConfig): string[] {
	if (config.framework === "react") {
		return [path.resolve(__dirname, "../react-shim.js")];
	}

	return [];
}

const esbuildOptions: esbuild.BuildOptions = {
	sourcemap: true,
	define: envVarsDefinitions,
	outdir: buildFolder,
	bundle: true,
	color: true,
	write: false,
	format: "esm",
	inject: resolveInjects(config),
	logLevel: "error",
	plugins: config.plugins,
	/*
	loader: {
		".png": "file",
		".svg": "file",
		".eot": "file",
		".woff": "file",
		".woff2": "file",
		".ttf": "file",
		".jpg": "file",
		".jpeg": "file",
	},
	*/
	publicPath: publicFolder,
	external: ["*.png", "*.svg", "*.eot", "*.woff", "*.woff2", "*.ttf", "*.jpg", "*.jpeg"],
};

function cleanBuildFolder() {
	del.sync([`${buildFolder}/**`, `!${buildFolder}`]);
}

async function lintApp(): Promise<LintResults> {
	return lintFile(srcFolder);
}

async function buildApp(entryPoint: string): Promise<[Error | null, esbuild.BuildResult | Partial<esbuild.BuildResult>]> {
	try {
		return [null, await esbuild.build({ ...esbuildOptions, entryPoints: [entryPoint] })];
	} catch (error) {
		console.log(error);
		return [error, { outputFiles: [] }];
	}
}

async function buildPublic(
	htmlFile: string,
	builtFiles: esbuild.OutputFile[] = [],
	config: DevScriptsConfig
): Promise<[BuiltFilesReport[], number, NodeJS.ErrnoException[]]> {
	const jsFiles: esbuild.OutputFile[] = [];
	const cssFiles: esbuild.OutputFile[] = [];

	const errors: NodeJS.ErrnoException[] = [];

	const fileSizes: BuiltFilesReport[] = [];

	let padLength = 0;

	for (const file of builtFiles) {
		const buffer = Buffer.from(file.contents);
		const gzipped = await gzip(buffer);

		const ext = path.parse(file.path).ext;

		if ([".js", ".css"].includes(ext)) {
			const hash = revHash(buffer);
			file.path = revPath(file.path, hash);

			switch (ext) {
				case ".js": {
					jsFiles.push(file);
					break;
				}

				case ".css": {
					cssFiles.push(file);
					break;
				}
			}

			if (!config.build.entryReturnsHTML) {
				const baseName = path.basename(file.path);
				const fileName = `${chalk.grey(path.dirname(path.relative(cwd, file.path)) + "/")}${chalk.cyan(baseName)}`;
				fileSizes.push({
					size: buffer.length,
					gzippedSize: gzipped.length,
					fileName,
				});
				if (fileName.length > padLength) {
					padLength = fileName.length;
				}
			}
		}

		if (config.build.entryReturnsHTML && (ext === ".js" || ext === ".js.map")) {
			continue;
		}
		fs.writeFileSync(file.path, file.contents, { encoding: "utf8" });
		fs.writeFileSync(`${file.path}.gz`, gzipped, { encoding: "utf8" });
	}

	let bundle_script = "";
	if (config.build.entryReturnsHTML) {
		const code = jsFiles.reduce((code, file) => {
			return code + file.text;
		}, "");

		const script = new vm.Script(code);
		const context = vm.createContext({ global: {} });
		bundle_script = script.runInContext(context);
	} else {
		bundle_script = jsFiles
			.map((file) => {
				return `<script charset="utf-8" src="/${path.relative(buildFolder, file.path)}" type="module"></script>`;
			})
			.join("");
	}

	const indexCode = nunjucks.render(htmlFile, {
		bundle_script,
		bundle_css: cssFiles
			.map((file) => {
				return `<link href="/${path.relative(buildFolder, file.path)}" rel="stylesheet" />`;
			})
			.join(""),
		...envVarsDefinitionsToTemplateVars(envVarsDefinitions),
	});

	const { name } = path.parse(htmlFile);
	fs.writeFileSync(`${buildFolder}/${name}.html`, indexCode, { encoding: "utf8" });

	return [fileSizes, padLength, errors];
}

async function build(): Promise<void> {
	console.clear();
	const cleanSpinner = ora("Cleaning build folder").start();
	await makeDir(buildFolder);
	cleanBuildFolder();
	cleanSpinner.succeed();

	//copy over other public files
	const copyPublicSpinner = ora("Copying public folder").start();

	const ignoredFiles = [];
	for (const entryPoint of config.entryPoints) {
		ignoredFiles.push(path.basename((await findPublicHTMLFileForEntryPoint(entryPoint, config)) as string));
	}

	await cpy([`**/*`, ...ignoredFiles.map((name) => `!${name}`)], buildFolder, {
		parents: true,
		cwd: publicFolder,
	});
	copyPublicSpinner.succeed();

	const buildSpinner = ora("Building app");
	const lintSpinner = ora(`${prefix("eslint")} Running`).start();
	const lintResult = await lintApp();

	if (lintResult.errorCount > 0 && !config.buildOnLintError) {
		lintSpinner.fail(`${prefix("eslint")} ${lintResult.errorCount} errors and ${lintResult.warningCount} warnings`);
		buildSpinner.fail(`${prefix("build")} Failed`);
		processLintResult(lintResult);
		return;
	}

	if (lintResult.warningCount > 0) {
		lintSpinner.warn(`${prefix("eslint")} ${lintResult.warningCount} warnings`);
	} else {
		lintSpinner.succeed(`${prefix("eslint")} OK`);
	}

	const tscLintSpinner = ora(`${prefix("typescript")} Running`).start();
	const tscLintResult = await tscLint();

	if (tscLintResult.length > 0 && !config.buildOnLintError) {
		tscLintSpinner.fail(`${prefix("typescript")} Failed`);

		buildSpinner.fail(`${prefix("build")} Failed`);
		processLintResult(lintResult);
		processTscLintResult(tscLintResult);
		return;
	}

	tscLintSpinner.succeed(`${prefix("typescript")} OK`);

	processLintResult(lintResult);
	processTscLintResult(tscLintResult);

	for (const entryPoint of config.entryPoints) {
		const [error, { outputFiles }] = await buildApp(entryPoint);
		const htmlFile = await findPublicHTMLFileForEntryPoint(entryPoint, config);

		if (htmlFile) {
			const [filesReport, padLength, errors] = await buildPublic(htmlFile, outputFiles, config);
			if (filesReport.length > 0) {
				console.log("File sizes after gzip:\n");
				console.log(
					filesReport
						.map((file) => {
							const gzippedChalk = file.gzippedSize < file.size ? chalk.green : chalk.red;
							return `  ${file.fileName.padEnd(padLength)} ${chalk.grey(prettyBytes(file.size))} ${figures.arrowRight} ${gzippedChalk(
								prettyBytes(file.gzippedSize)
							)}`;
						})
						.join("\n")
				);
			}
			if (errors.length) {
				console.log({ errors });
			}
		}
	}

	buildSpinner.succeed(`${prefix("build")} OK`);

	console.log("\n");

	console.log(`The project was built assuming it is hosted at ${chalk.green("/")}.
You can control this with the ${chalk.green("homepage")} field in your package.json.

The ${chalk.cyan("build")} folder is ready to be deployed.
You may serve it with a static server:
	
  ${chalk.cyan("yarn")} global add serve
  ${chalk.cyan("serve")} -s build\n`);
}

(async () => {
	await build();
	process.exit();
})();
