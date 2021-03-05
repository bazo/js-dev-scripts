import * as esbuild from "esbuild";
import { resolve } from "path";
import { cleanBuildFolder } from "../../build-functions";

const buildFolder = resolve("./dist");

const esbuildOptions: esbuild.BuildOptions = {
	outfile: "dist/index.js",
	define: {
		"process.env.NODE_ENV": '"production"',
	},
	color: true,
	write: true,
	minify: true,
	target: "es6",
	logLevel: "error",
	entryPoints: ["src/dev.tsx"],
	pure: [],
	tsconfig: "./tsconfig.json",
	bundle: true,
	format: "esm",
};

async function build(): Promise<void> {
	cleanBuildFolder(buildFolder);

	esbuild.build(esbuildOptions);
}

build();
