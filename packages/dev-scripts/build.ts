import * as esbuild from "esbuild";
import { copyFileSync } from "fs";
import del from "del";

const buildFolder = "./dist";

const esbuildOptions: esbuild.BuildOptions = {
	outdir: buildFolder,
	//sourcemap: "external",
	define: {
		"process.env.MODE": '"production"',
		"process.env.FILE_EXT": '"js"',
	},
	color: true,
	write: true,
	//minify: true,
	logLevel: "error",
	target: "node15",
	platform: "node",
	entryPoints: ["bin/dev-scripts.ts", "scripts/build.ts", "scripts/start.ts", "scripts/test.ts"],
	pure: [],
	tsconfig: "./tsconfig.build.json",
	bundle: true,
	external: ["esbuild", "@bazo/js-dev-overlay", "eslint", "espree"],
};

function cleanBuildFolder() {
	del.sync([`${buildFolder}/**`, `!${buildFolder}`]);
}

async function build(): Promise<void> {
	cleanBuildFolder();
	const r = await esbuild.build(esbuildOptions);
	console.log(r);

	copyFileSync("./react-shim.js", `${buildFolder}/react-shim.js`);
}

build();
