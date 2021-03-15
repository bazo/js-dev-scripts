import execa from "execa";
import { resolve } from "path";

import { cleanBuildFolder } from "../../build-functions";

const buildFolder = resolve("./dist");

async function build(): Promise<void> {
	cleanBuildFolder(buildFolder);

	await execa.command(`tsc --project tsconfig.json`, {
		extendEnv: true,
		windowsHide: false,
		cwd: process.cwd(),
	});
}

build();
