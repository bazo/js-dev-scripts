import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import chokidar from "chokidar";
import getPort from "get-port";
import * as esbuild from "esbuild";
import * as nunjucks from "nunjucks";
import { ESLint } from "eslint";

async function start() {
	const preferredPort = parseInt(process.env.PORT || "3000");
	const port = await getPort({ port: preferredPort });

	startServer(port);
}

const mimeTypes = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpg",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".wav": "audio/wav",
	".mp4": "video/mp4",
	".woff": "application/font-woff",
	".ttf": "application/font-ttf",
	".eot": "application/vnd.ms-fontobject",
	".otf": "application/font-otf",
	".wasm": "application/wasm",
};

type Extname = keyof typeof mimeTypes;

const cwd = process.cwd();
const srcFolder = path.resolve(cwd, "./src");
const publicFolder = path.resolve(cwd, "./public");
const indexFile = path.resolve(cwd, publicFolder, "index.html");

const esbuildOptions: esbuild.BuildOptions = {
	entryPoints: [srcFolder + "/index.tsx"],
	sourcemap: true,
	define: {
		"process.env.NODE_ENV": '"development"',
	},
	bundle: true,
	color: true,
	write: false,
	format: "esm",
	incremental: true,
	inject: [path.resolve(__dirname, "../react-shim.js")],
};

const eslint = new ESLint({
	useEslintrc: true,
});

class FileManager {
	filesMap = new Map<string, string>();

	public setFile(name: string, contents: string): void {
		this.filesMap.set(name, contents);
	}

	public getContents(name: string): string | undefined {
		return this.filesMap.get(name);
	}

	public hasFile(name: string): boolean {
		return this.filesMap.has(name);
	}
}

const fm = new FileManager();

async function buildApp() {
	const res = await esbuild.build(esbuildOptions);
	//console.log({ res });
	for (const file of res.outputFiles!) {
		//console.log({ file });
		fm.setFile("bundle.js", file.text);
	}
	console.log({ warnings: res.warnings });
}

async function buildPublic() {
	const indexCode = nunjucks.render(indexFile, {
		bundle_script: '<script charset="utf-8" src="bundle.js" type="module"></script>',
	});

	//console.log({ indexCode });

	fm.setFile("index.html", indexCode);

	fs.readdir(publicFolder, { encoding: "utf-8" }, (err, files) => {
		//console.log({ files });
	});
}

// One-liner for current directory
chokidar.watch(srcFolder, { awaitWriteFinish: false, ignoreInitial: true }).on("all", async (event, path) => {
	console.log(event, { path });
	if (!["change", "add"].includes(event)) {
		return;
	}

	const results = await eslint.lintFiles(path);
	console.log({ result: results[0], results: results[0].messages });
	buildApp();
});

chokidar.watch(publicFolder).on("all", (event, path) => {
	//console.log(event, path);
	if (event !== "add") {
		return;
	}
	buildPublic();
});

async function startServer(port: number): Promise<void> {
	http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
		let filePath = request.url!;
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
	}).listen(port);
	console.log(`Server running at http://127.0.0.1:${port}`);
}

buildApp();
buildPublic();

start();
