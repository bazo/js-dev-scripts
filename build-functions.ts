import del from "del";
import { writeFileSync } from "fs";
import { dirname } from "path";
import sortPackageJson from "sort-package-json";

const repository = {
	type: "git",
	url: "https://github.com/bazo/js-dev-scripts",
};
const author = {
	name: "Martin Bažík",
	email: "martin@bazo.sk",
	url: "https://bazo.sk",
};

export function cleanBuildFolder(buildFolder: string) {
	del.sync([`${buildFolder}/**`, `!${buildFolder}`]);
}

export function generatePackageJson(buildFolder: string) {
	const dir = dirname(buildFolder);
	const pkg = require(`${dir}/package.json`);
	const pkgDist = require(`${dir}/package.dist.json`);

	const newPkg = sortPackageJson({ ...pkgDist, dependencies: pkg.dependencies, version: pkg.version, repository, author, license: pkg.license });

	writeFileSync(`${buildFolder}/package.json`, JSON.stringify(newPkg, null, 4));
}
