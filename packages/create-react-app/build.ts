import * as esbuild from "esbuild";
import { resolve } from "path";

import { cleanBuildFolder } from "../../build-functions";

const buildFolder = resolve("./dist");

const esbuildOptions: esbuild.BuildOptions = {
	outdir: buildFolder,
	color: true,
	write: true,
	minify: true,
	logLevel: "error",
	target: "node15",
	platform: "node",
	entryPoints: ["index.ts"],
	tsconfig: "./tsconfig.build.json",
	bundle: true,
	external: [],
};

async function build(): Promise<void> {
	cleanBuildFolder(buildFolder);
	esbuild.build(esbuildOptions);
}

build();
