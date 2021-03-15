import { resolve } from "path";

import { generatePackageJson } from "../../build-functions";

const buildFolder = resolve("./dist");

async function prepack(): Promise<void> {
	generatePackageJson(buildFolder);
}

prepack();
