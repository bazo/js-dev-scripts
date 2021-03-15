/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Extname, LintResults, mimeTypes } from "@bazo/js-dev-scripts-types";
import chalk from "chalk";
import chokidar from "chokidar";
import debounce from "debounce-promise";
import * as esbuild from "esbuild";
import * as fs from "fs";
import getPort from "get-port";
import globby from "globby";
import * as http from "http";
import * as nunjucks from "nunjucks";
import * as path from "path";
import revHash from "rev-hash";
//@ts-ignore
import revPath from "rev-path";
import * as vm from "vm";
import * as WebSocket from "ws";

import {
	DevScriptsConfig,
	envVarsDefinitionsToTemplateVars,
	findPublicHTMLFileForEntryPoint,
	getEnvVarsDefinitions,
	loadConfig,
} from "../lib/config";
import FileManager from "../lib/fileManager";
import { createMessage, formatChokidarEvent, processLintResult } from "../lib/functions";
import { lintFile } from "../lib/lint";
import proxy from "../lib/proxy/client";

process.env.NODE_ENV = "development";
const HOST = process.env.HOST || "0.0.0.0";

const config = loadConfig();

const { testGlob, srcGlob, srcFolder, buildFolder, publicFolder } = config;

const envVarsDefinitions = {
	"process.env.NODE_ENV": '"development"',
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
	incremental: true,
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

nunjucks.configure({
	noCache: true,
});

const fm = new FileManager();

const devJS = fs.readFileSync(require.resolve("@bazo/js-dev-overlay"), "utf8");

fm.setFile("/dev.js", devJS);

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

function getMemoryPath(filePath: string): string {
	return `/${path.relative(buildFolder, filePath)}`;
}

function getPublicMemoryPath(filePath: string): string {
	return `/${path.relative(publicFolder, filePath)}`;
}

async function buildPublic(htmlFile: string, builtFiles: esbuild.OutputFile[] = [], config: DevScriptsConfig, wsPort: number): Promise<void> {
	if (builtFiles.length === 0) {
		return;
	}
	const jsFiles: esbuild.OutputFile[] = [];
	const cssFiles: esbuild.OutputFile[] = [];

	for (const file of builtFiles) {
		const buffer = Buffer.from(file.contents);

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
		}

		fm.setFile(getMemoryPath(file.path), file.text);
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
		bundle_script =
			`<script charset="utf-8">window.WEBSOCKET_PORT=${wsPort.toString()};</script><script charset="utf-8" src="/dev.js" type="module"></script>` +
			jsFiles
				.map((file) => {
					return `<script charset="utf-8" src="${getMemoryPath(file.path)}" type="module"></script>`;
				})
				.join("");
	}

	const htmlCode = nunjucks.render(htmlFile, {
		bundle_script,
		bundle_css: cssFiles
			.map((file) => {
				return `<link href="${getMemoryPath(file.path)}" rel="stylesheet" />`;
			})
			.join(""),
		...envVarsDefinitionsToTemplateVars(envVarsDefinitions),
	});

	const { name } = path.parse(htmlFile);
	fm.setFile(`/${name}.html`, htmlCode);
}

async function build(config: DevScriptsConfig, wsPort: number): Promise<void> {
	const otherFiles = await globby([`${publicFolder}/**/*`, `!${publicFolder}/index.html`]);

	for (const otherFile of otherFiles) {
		fs.readFile(otherFile, (err, code) => {
			fm.setFile(getPublicMemoryPath(otherFile), code);
		});
	}

	for (const entryPoint of config.entryPoints) {
		const [error, { outputFiles }] = await buildApp(entryPoint);
		const htmlFile = await findPublicHTMLFileForEntryPoint(entryPoint, config);
		if (htmlFile) {
			buildPublic(htmlFile, outputFiles, config, wsPort);
		}
	}
}

async function startServer(config: DevScriptsConfig, port: number): Promise<WebSocket.Server> {
	console.log(chalk.cyan("Starting the development server...\n"));
	const server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
		let filePath = request.url || "/";
		if (filePath == "/") {
			filePath = "/index.html";
		}

		const extname = String(path.extname(filePath)).toLowerCase() as Extname;

		const contentType = mimeTypes[extname] || "application/octet-stream";

		if (fm.hasFile(filePath)) {
			const content = fm.getContents(filePath);
			response.writeHead(200, { "Content-Type": contentType });
			response.end(content, "utf-8");
		} else {
			if (config.proxy) {
				for (const [route, proxyOptions] of Object.entries(config.proxy)) {
					const regex = `${route}(.*)`;
					const match = filePath.match(regex);
					if (match) {
						const url = `${proxyOptions.target}${match[1]}`;
						proxy(request, response, url);
						return;
					}
				}
			}

			const content = fm.getContents("/index.html");
			response.writeHead(200, { "Content-Type": "text/html" });
			response.end(content, "utf-8");
		}
	});

	const wss = new WebSocket.Server({ server });

	wss.on("connection", (ws) => {
		ws.on("message", (message) => {
			console.log("received: %s", message);
		});
		ws.send(createMessage("dev-server-connected"));
	});

	server.listen(port, HOST, undefined, () => {
		["SIGINT", "SIGTERM"].forEach(function (sig) {
			process.on(sig, function () {
				server.close();
				process.exit();
			});
		});

		// Gracefully exit when stdin ends
		process.stdin.on("end", function () {
			server.close();
			process.exit();
		});
		process.stdin.resume();
	});

	console.log(chalk.green(`Server running at http://127.0.0.1:${port}`));
	return wss;
}

let wss: WebSocket.Server;
async function start() {
	console.clear();

	const preferredPort = process.env.PORT ? parseInt(process.env.PORT) : config.port;
	const port = await getPort({ port: preferredPort });

	wss = await startServer(config, port);

	const notifyBuildStart = () => {
		if (wss) {
			wss.clients.forEach((ws) => {
				ws.send(createMessage("bundle-build-start", { warnings: [] }));
			});
		}
	};

	const notifyBuildEnd = () => {
		if (wss) {
			wss.clients.forEach((ws) => {
				ws.send(createMessage("bundle-build-end", { warnings: [] }));
			});
		}
	};

	const onSourceFileChange = debounce(async () => {
		notifyBuildStart();
		const lintResult = await lintApp();

		processLintResult(lintResult);

		if (lintResult.errorCount === 0 || config.buildOnLintError) {
			await build(config, port);
		}
		notifyBuildEnd();
	}, 100);

	const onPublicFileChange = debounce(async () => {
		notifyBuildStart();

		await build(config, port);
		notifyBuildEnd();
	}, 100);

	const lintResult = await lintApp();
	processLintResult(lintResult);
	if (lintResult.errorCount === 0 || config.buildOnLintError) {
		build(config, port);
	}

	chokidar.watch(srcGlob, { awaitWriteFinish: false, ignoreInitial: true, ignored: testGlob }).on("all", async (event, path) => {
		if (!["change"].includes(event)) {
			return;
		}

		console.log(formatChokidarEvent(event, path));

		onSourceFileChange();
	});

	chokidar.watch(publicFolder, { awaitWriteFinish: false, ignoreInitial: true }).on("all", async (event, path) => {
		if (!["change", "add"].includes(event)) {
			return;
		}

		console.log(formatChokidarEvent(event, path));

		onPublicFileChange();
	});
}

start();

//@TODO: https://medium.com/@maheshsenni/creating-a-module-bundler-with-hot-module-replacement-b439f0cc660f
