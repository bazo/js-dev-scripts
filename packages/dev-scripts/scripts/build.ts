/* eslint-disable @typescript-eslint/ban-ts-comment */
require("pretty-error").start();
import * as fs from "fs";
import * as path from "path";
import * as esbuild from "esbuild";
import * as nunjucks from "nunjucks";
import { BuiltFilesReport, LintResults } from "../lib/types";
import { lintFile, tscLint } from "../lib/lint";
import { prefix, processLintResult, processTscLintResult } from "../lib/functions";
import del from "del";
import ora from "ora";
import makeDir from "make-dir";
import cpy from "cpy";
import chalk from "chalk";
import revHash from "rev-hash";
//@ts-ignore
import revPath from "rev-path";
import { gzip } from "../lib/gzip";
import prettyBytes from "pretty-bytes";
import figures from "figures";

process.env.NODE_ENV = "production";

const cwd = process.cwd();
const buildFolder = path.resolve(cwd, "./build");
const srcFolder = path.resolve(cwd, "./src");
const publicFolder = path.resolve(cwd, "./public");
const indexFile = path.resolve(cwd, publicFolder, "index.html");

const esbuildOptions: esbuild.BuildOptions = {
	entryPoints: [srcFolder + "/index.tsx"],
	outdir: buildFolder,
	sourcemap: true,
	define: {
		"process.env.NODE_ENV": '"production"',
	},
	bundle: true,
	color: true,
	write: false,
	format: "esm",
	//inject: [path.resolve(__dirname, "../react-shim.js")],
	minify: true,
	splitting: true,
	logLevel: "error",
};

function cleanBuildFolder() {
	del.sync([`${buildFolder}/**`, `!${buildFolder}`]);
}

async function lintApp(): Promise<LintResults> {
	return lintFile(srcFolder);
}

async function buildApp(): Promise<esbuild.BuildResult> {
	return await esbuild.build(esbuildOptions);
}

async function buildPublic(builtFiles: esbuild.OutputFile[] = []): Promise<[BuiltFilesReport[], number, NodeJS.ErrnoException[]]> {
	const jsFiles: esbuild.OutputFile[] = [];
	const cssFiles: esbuild.OutputFile[] = [];

	const errors: NodeJS.ErrnoException[] = [];

	const errorPush = (error: NodeJS.ErrnoException | null) => {
		if (error) {
			errors.push(error);
		}
	};

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

		fs.writeFile(file.path, file.contents, { encoding: "utf8" }, errorPush);
		fs.writeFile(`${file.path}.gz`, gzipped, { encoding: "utf8" }, errorPush);
	}

	const indexCode = nunjucks.render(indexFile, {
		bundle_script: jsFiles
			.map((file) => {
				return `<script charset="utf-8" src="/${path.relative(buildFolder, file.path)}" type="module"></script>`;
			})
			.join(""),
		bundle_css: cssFiles
			.map((file) => {
				return `<link href="/${path.relative(buildFolder, file.path)}" rel="stylesheet" />`;
			})
			.join(""),
	});

	fs.writeFile(`${buildFolder}/index.html`, indexCode, { encoding: "utf8" }, errorPush);

	//copy over other public files
	await makeDir(buildFolder);
	await cpy([`**/*`, `!index.html`], buildFolder, {
		parents: true,
		cwd: publicFolder,
	});

	return [fileSizes, padLength, errors];
}

async function build(): Promise<void> {
	console.clear();
	const cleanSpinner = ora("Cleaning build folder").start();
	cleanBuildFolder();
	cleanSpinner.succeed();

	const buildSpinner = ora("Building app");

	const lintSpinner = ora(`${prefix("eslint")} Running`).start();
	const lintResult = await lintApp();

	if (lintResult.errorCount > 0) {
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

	if (tscLintResult.length > 0) {
		tscLintSpinner.fail(`${prefix("typescript")} Failed`);

		buildSpinner.fail(`${prefix("build")} Failed`);
		processLintResult(lintResult);
		processTscLintResult(tscLintResult);
		return;
	}

	tscLintSpinner.succeed(`${prefix("typescript")} OK`);

	const { outputFiles } = await buildApp();

	const [filesReport, padLength] = await buildPublic(outputFiles);

	buildSpinner.succeed(`${prefix("build")} OK`);

	processLintResult(lintResult);
	processTscLintResult(tscLintResult);

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

	console.log("\n");

	console.log(`The project was built assuming it is hosted at ${chalk.green("/")}.
You can control this with the ${chalk.green("homepage")} field in your package.json.

The ${chalk.cyan("build")} folder is ready to be deployed.
You may serve it with a static server:
	
  ${chalk.cyan("yarn")} global add serve
  ${chalk.cyan("serve")} -s build\n`);
}

build();
