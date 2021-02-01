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

const devJS = fs.readFileSync(path.resolve(__dirname, "../dev/dev.js"), "utf8");

fm.setFile("dev.js", devJS);

async function lintApp(): Promise<LintResults> {
	return lintFile(srcFolder);
}

async function buildApp(wss?: WebSocket.Server) {
	const { warnings, outputFiles } = await esbuild.build(esbuildOptions);
	for (const file of outputFiles || []) {
		fm.setFile("bundle.js", file.text);
	}
	if (wss) {
		wss.clients.forEach((ws) => {
			ws.send(createMessage("bundle-built", { warnings }));
		});
	}
}

async function buildPublic(wsPort: number, wss?: WebSocket.Server) {
	const indexCode = nunjucks.render(indexFile, {
		bundle_script: `
		<script charset="utf-8">window.WEBSOCKET_PORT=${wsPort};</script>
		<script charset="utf-8" src="dev.js" type="module"></script>
		<script charset="utf-8" src="bundle.js" type="module"></script>
		`,
	});

	//console.log({ indexCode });

	fm.setFile("index.html", indexCode);

	fs.readdir(publicFolder, { encoding: "utf-8" }, (err, files) => {
		//console.log({ files });
	});
}

async function startServer(port: number): Promise<WebSocket.Server> {
	console.log(chalk.cyan("Starting the development server...\n"));
	const server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
		let filePath = request.url || "/";
		if (filePath == "/") {
			filePath = "/index.html";
		}

		filePath = filePath.slice(1);

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
	processLintResult(lintResult);
	if (lintResult.errorCount === 0) {
		buildApp();
	}

	buildPublic(port);

	chokidar.watch(srcFolder, { awaitWriteFinish: false, ignoreInitial: true }).on("all", async (event, path) => {
		if (!["change"].includes(event)) {
			return;
		}

		console.log(formatChokidarEvent(event, path));

		const lintResult = await lintFile(path);

		processLintResult(lintResult);

		if (lintResult.errorCount === 0) {
			buildApp(wss);
		}
	});

	chokidar.watch(publicFolder, { awaitWriteFinish: false, ignoreInitial: true }).on("all", (event, path) => {
		if (!["change", "add"].includes(event)) {
			return;
		}

		console.log(formatChokidarEvent(event, path));

		buildPublic(port, wss);
	});
}

start();

//@TODO: https://medium.com/@maheshsenni/creating-a-module-bundler-with-hot-module-replacement-b439f0cc660f
