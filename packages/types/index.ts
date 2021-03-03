import type { ESLint } from "eslint";

export const mimeTypes = {
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

export type Extname = keyof typeof mimeTypes;

export interface LintResults {
	errorCount: number;
	warningCount: number;
	results: ESLint.LintResult[];
}

export interface Message {
	event: "dev-server-connected" | "bundle-build-start" | "bundle-build-end";
	data: unknown;
}

export interface BuiltFilesReport {
	size: number;
	gzippedSize: number;
	fileName: string;
}
