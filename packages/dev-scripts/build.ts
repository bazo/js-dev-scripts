import * as esbuild from "esbuild";
import { cleanBuildFolder, generatePackageJson } from "../../build-functions";
import { resolve } from "path";

const buildFolder = resolve("./dist");
import { copyFileSync } from "fs";

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
	external: ["esbuild", "@bazo/js-dev-overlay", "eslint", "espree"],
};

async function build(): Promise<void> {
	cleanBuildFolder(buildFolder);
	esbuild.build(esbuildOptions);

	copyFileSync("./react-shim.js", `${buildFolder}/react-shim.js`);

	generatePackageJson(buildFolder);
}

build();
