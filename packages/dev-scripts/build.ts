import * as esbuild from "esbuild";
import { copyFileSync } from "fs";
import { resolve } from "path";

import { cleanBuildFolder } from "../../build-functions";

const buildFolder = resolve("./dist");

const esbuildOptions: esbuild.BuildOptions = {
	outdir: buildFolder,
	//sourcemap: "external",
	define: {
		"process.env.MODE": '"production"',
		"process.env.FILE_EXT": '"js"',
	},
	color: true,
	write: true,
	minify: true,
	logLevel: "error",
	target: "node15",
	platform: "node",
	entryPoints: [
		"bin/dev-scripts.ts",
		"scripts/build.ts",
		"scripts/start.ts",
		"scripts/test.ts",
		"plugins/postcss.ts",
		"plugins/scss.ts",
		"plugins/external.ts",
	],
	pure: [],
	tsconfig: "./tsconfig.build.json",
	bundle: true,
	external: ["esbuild", "@bazo/js-dev-overlay", "react", "eslint", "espree", "expect", "sass", "pretty-error", "typescript"],
};

async function build(): Promise<void> {
	cleanBuildFolder(buildFolder);
	esbuild.build(esbuildOptions);

	copyFileSync("./react-shim.js", `${buildFolder}/react-shim.js`);
	copyFileSync("./env.d.ts", `${buildFolder}/env.d.ts`);
}

build();
