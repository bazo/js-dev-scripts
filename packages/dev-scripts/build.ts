import * as esbuild from "esbuild";
import { cleanBuildFolder } from "../../build-functions";
import { resolve } from "path";

const buildFolder = resolve("./dist");
import { copyFileSync } from "fs";
import execa from "execa";

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
	entryPoints: ["bin/dev-scripts.ts", "scripts/build.ts", "scripts/start.ts", "scripts/test.ts"],
	pure: [],
	tsconfig: "./tsconfig.build.json",
	bundle: true,
	external: ["esbuild", "@bazo/js-dev-overlay", "eslint", "espree", "expect"],
};

async function build(): Promise<void> {
	cleanBuildFolder(buildFolder);
	esbuild.build(esbuildOptions);

	await execa.command(`tsc --project ./types/tsconfig.json`, {
		extendEnv: true,
		windowsHide: false,
		cwd: process.cwd(),
	});

	copyFileSync("./react-shim.js", `${buildFolder}/react-shim.js`);
	copyFileSync("./env.d.ts", `${buildFolder}/env.d.ts`);
}

build();
