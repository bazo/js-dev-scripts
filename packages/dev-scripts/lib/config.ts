import { cosmiconfigSync } from "cosmiconfig";
import * as fs from "fs";
import * as path from "path";

import { typeScriptLoaderSync as TypeScriptLoader } from "./typescriptLoader";

const cwd = process.cwd();

interface ProxyOptions {
	target: string;
}

interface ProxyConfig {
	[route: string]: ProxyOptions;
}

export type DevScriptsConfig = {
	srcFolder: string;
	entryPoints: string[];
	buildFolder: string;
	publicFolder: string;
	tempFolder: string;
	testGlob: string;
	srcGlob: string;
	plugins: never[];
	port: number;
	buildOnLintError: boolean;
	build: {
		entryReturnsHTML?: boolean;
	};
	framework: undefined | "react";
	proxy: undefined | ProxyConfig;
};

const defaultConfig: DevScriptsConfig = {
	srcFolder: "./src",
	entryPoints: ["index.tsx"],
	buildFolder: "./build",
	publicFolder: "./public",
	tempFolder: "./temp",
	testGlob: `**/*.test.(ts|tsx|js|jsx)`,
	srcGlob: `**/*(?!test).(ts|tsx|js|jsx)`,
	plugins: [],
	port: 3000,
	buildOnLintError: true,
	build: {
		entryReturnsHTML: false,
	},
	framework: "react",
	proxy: undefined,
};

export function loadConfig(): DevScriptsConfig {
	const moduleName = "devscripts";
	const explorerSync = cosmiconfigSync(moduleName, {
		searchPlaces: [
			"package.json",
			`.${moduleName}rc`,
			`.${moduleName}rc.json`,
			`.${moduleName}rc.yaml`,
			`.${moduleName}rc.yml`,
			`.${moduleName}rc.ts`,
			`.${moduleName}rc.js`,
			`${moduleName}.config.ts`,
			`${moduleName}.config.js`,
		],
		loaders: { ".ts": TypeScriptLoader },
	});
	const config = { ...defaultConfig, ...explorerSync.search()?.config };

	const srcFolder = path.resolve(cwd, config.srcFolder);

	return {
		...config,
		srcFolder,
		entryPoints: config.entryPoints.map((entryPoint: string) => `${srcFolder}/${entryPoint}`),
		buildFolder: path.resolve(cwd, config.buildFolder),
		publicFolder: path.resolve(cwd, config.publicFolder),
		tempFolder: path.resolve(cwd, config.tempFolder),
		testGlob: `${srcFolder}/**/*.test.(ts|tsx|js|jsx)`,
		srcGlob: `${srcFolder}/**/*(?!test).*`,
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

export function getEnvVarsDefinitions(): Record<string, string> {
	return Object.entries(process.env)
		.filter(([key, value]) => {
			return key.startsWith("APP_") || key.startsWith("JS_APP_") || key.startsWith("REACT_APP_");
		})
		.reduce((acc, [key, value]) => {
			return { ...acc, [`process.env.${key}`]: `"${value}"` };
		}, {});
}

export function envVarsDefinitionsToTemplateVars(definitions: Record<string, string>): Record<string, string> {
	return Object.entries(definitions)
		.map(([key, value]) => {
			return [key.replace("process.env.", ""), value];
		})
		.reduce((acc, [key, value]) => {
			return { ...acc, [key]: value.replaceAll(`"`, "") };
		}, {});
}
