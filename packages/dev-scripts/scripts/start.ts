/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import chokidar from "chokidar";
import getPort from "get-port";
import * as esbuild from "esbuild";
import * as nunjucks from "nunjucks";
import * as WebSocket from "ws";
import chalk from "chalk";
import FileManager from "../lib/fileManager";
import { Extname, LintResults, mimeTypes } from "../lib/types";
import { clearConsole, createMessage, formatChokidarEvent, processLintResult } from "../lib/functions";
import { lintFile } from "../lib/lint";
import revHash from "rev-hash";
//@ts-ignore
import revPath from "rev-path";

process.env.NODE_ENV = "development";
const HOST = process.env.HOST || "0.0.0.0";

const cwd = process.cwd();
const buildFolder = path.resolve(cwd, "./build");
const srcFolder = path.resolve(cwd, "./src");
const publicFolder = path.resolve(cwd, "./public");
const indexFile = path.resolve(cwd, publicFolder, "index.html");

const esbuildOptions: esbuild.BuildOptions = {
	entryPoints: [srcFolder + "/index.tsx"],
	sourcemap: true,
	define: {
		"process.env.NODE_ENV": '"development"',
	},
	outdir: buildFolder,
	bundle: true,
	color: true,
	write: false,
	format: "esm",
	incremental: true,
	inject: [path.resolve(__dirname, "../react-shim.js")],
	logLevel: "error",
};

const fm = new FileManager();

const devJS = fs.readFileSync(require.resolve("@bazo/js-dev-overlay"), "utf8");

fm.setFile("/dev.js", devJS);

async function lintApp(): Promise<LintResults> {
	return lintFile(srcFolder);
}
async function buildApp(): Promise<esbuild.BuildResult> {
	return await esbuild.build(esbuildOptions);
}

function getMemoryPath(filePath: string): string {
	return `/${path.relative(buildFolder, filePath)}`;
}

async function buildPublic(builtFiles: esbuild.OutputFile[] = [], wsPort: number): Promise<void> {
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

	const indexCode = nunjucks.render(indexFile, {
		bundle_script:
			`<script charset="utf-8">window.WEBSOCKET_PORT=${wsPort.toString()};</script><script charset="utf-8" src="/dev.js" type="module"></script>` +
			jsFiles
				.map((file) => {
					return `<script charset="utf-8" src="${getMemoryPath(file.path)}" type="module"></script>`;
				})
				.join(""),
		bundle_css: cssFiles
			.map((file) => {
				return `<link href="${getMemoryPath(file.path)}" rel="stylesheet" />`;
			})
			.join(""),
	});

	fm.setFile(`/index.html`, indexCode);
}

async function startServer(port: number): Promise<WebSocket.Server> {
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
			const content = fm.getContents("index.html");
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
	const preferredPort = parseInt(process.env.PORT || "3000");
	const port = await getPort({ port: preferredPort });

	wss = await startServer(port);

	const lintResult = await lintApp();

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

	processLintResult(lintResult);
	if (lintResult.errorCount === 0) {
		const { outputFiles } = await buildApp();
		buildPublic(outputFiles, port);
	}

	chokidar.watch(srcFolder, { awaitWriteFinish: false, ignoreInitial: true }).on("all", async (event, path) => {
		if (!["change"].includes(event)) {
			return;
		}

		console.log(formatChokidarEvent(event, path));

		notifyBuildStart();
		const lintResult = await lintFile(path);

		processLintResult(lintResult);

		if (lintResult.errorCount === 0) {
			const { outputFiles } = await buildApp();
			buildPublic(outputFiles, port);
		}
		notifyBuildEnd();
	});

	chokidar.watch(publicFolder, { awaitWriteFinish: false, ignoreInitial: true }).on("all", async (event, path) => {
		if (!["change", "add"].includes(event)) {
			return;
		}

		console.log(formatChokidarEvent(event, path));

		notifyBuildStart();
		const { outputFiles } = await buildApp();
		buildPublic(outputFiles, port);
		notifyBuildEnd();
	});
}

start();

//@TODO: https://medium.com/@maheshsenni/creating-a-module-bundler-with-hot-module-replacement-b439f0cc660f
