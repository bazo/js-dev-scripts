import execa from "execa";
import { cleanBuildFolder, generatePackageJson } from "../../build-functions";
import { resolve } from "path";

const buildFolder = resolve("./dist");


async function build(): Promise<void> {
	cleanBuildFolder(buildFolder);

	await execa.command(`tsc --project tsconfig.json`, {
		extendEnv: true,
		windowsHide: false,
		cwd: process.cwd(),
	});

	generatePackageJson(buildFolder);
}

build();
