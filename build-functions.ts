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

export function cleanBuildFolder(buildFolder: string): void {
	del.sync([`${buildFolder}/**`, `!${buildFolder}`]);
}

export function generatePackageJson(buildFolder: string): void {
	const dir = dirname(buildFolder);
	const pkg = require(`${dir}/package.json`);
	const pkgDist = require(`${dir}/package.dist.json`);

	const newPkg = sortPackageJson({
		...pkgDist,
		version: pkg.version,
		repository,
		author,
		license: pkg.license,
		name: pkg.name,
		publishConfig: pkg.publishConfig,
	});

	writeFileSync(`${buildFolder}/package.json`, JSON.stringify(newPkg, null, 4));
}
