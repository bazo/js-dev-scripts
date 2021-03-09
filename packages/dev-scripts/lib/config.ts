import { cosmiconfigSync } from "cosmiconfig";
import * as path from "path";
import * as fs from "fs";
const cwd = process.cwd();

const defaultConfig = {
	srcFolder: "./src",
	entryPoints: ["index.tsx"],
	buildFolder: "./build",
	publicFolder: "./public",
	testGlob: `**/*.test.(ts|tsx|js|jsx)`,
	srcGlob: `**/*(?!test).(ts|tsx|js|jsx)`,
	port: 3000,
	buildOnLintError: true,
};

export type DevScriptsConfig = typeof defaultConfig;

export function loadConfig(): DevScriptsConfig {
	const explorerSync = cosmiconfigSync("dev-scripts");
	const config = { ...defaultConfig, ...explorerSync.search()?.config };

	const srcFolder = path.resolve(cwd, config.srcFolder);

	return {
		srcFolder,
		entryPoints: config.entryPoints.map((entryPoint: string) => `${srcFolder}/${entryPoint}`),
		buildFolder: path.resolve(cwd, config.buildFolder),
		publicFolder: path.resolve(cwd, config.publicFolder),
		testGlob: `${srcFolder}/**/*.test.(ts|tsx|js|jsx)`,
		srcGlob: `${srcFolder}/**/*(?!test).(ts|tsx|js|jsx)`,
		port: config.port,
		buildOnLintError: config.buildOnLintError,
	};
}

export async function findPublicHTMLFileForEntryPoint(entryPoint: string, config: DevScriptsConfig): Promise<string | null> {
	const { name } = path.parse(entryPoint);
	const htmlFile = `${config.publicFolder}/${name}.html`;

	return new Promise((resolve, reject) => {
		fs.stat(htmlFile, (error) => {
			if (!error) {
				resolve(htmlFile);
			} else {
				resolve(null);
			}
		});
	});
}
