import { generatePackageJson } from "../../build-functions";
import { resolve } from "path";

const buildFolder = resolve("./dist");

async function prepack(): Promise<void> {
	generatePackageJson(buildFolder);
}

prepack();
