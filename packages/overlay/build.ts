import execa from "execa";
import { resolve } from "path";
import { cleanBuildFolder } from "../../build-functions";

const buildFolder = resolve("./dist");

async function build(): Promise<void> {
	cleanBuildFolder(buildFolder);

	await execa.command(
		`esbuild src/dev.tsx --outfile=dist/index.js --bundle --minify --sourcemap=inline --define:process.env.NODE_ENV="production" --format=esm --tsconfig=./tsconfig.json`,
		{
			extendEnv: true,
			windowsHide: false,
			cwd: process.cwd(),
		}
	);
}

build();
