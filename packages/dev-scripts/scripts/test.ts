/* eslint-disable @typescript-eslint/ban-ts-comment */
import chalk from "chalk";
import chokidar from "chokidar";
import * as esbuild from "esbuild";
import expect from "expect";
import figures from "figures";
import * as fs from "fs";
import globby from "globby";
import * as path from "path";
import { without } from "ramda";
//@ts-ignore
import sourceMapURL from "source-map-url";
import * as vm from "vm";

import { DevScriptsConfig, getEnvVarsDefinitions, loadConfig } from "../lib/config";
import {
	formatChokidarEvent,
	formatTestDuration,
	getMillisecondsFromHrTime,
	padMultilineText,
	showErrorOrigin,
	showTotalResults,
} from "../lib/functions";
import Tester, { Results, SuiteResults } from "../lib/testing/runtime";

process.env.NODE_ENV = "development";

const config = loadConfig();

const { srcFolder } = config;

class TestMemory {
	testFiles: string[] = [];
	lastResult: Results | null = null;

	public addTestFile(filePath: string): void {
		if (!this.testFiles.includes(filePath)) {
			this.testFiles.push(filePath);
		}
	}

	public removeTestFile(filePath: string): void {
		if (this.testFiles.includes(filePath)) {
			this.testFiles = without([filePath], this.testFiles);
		}
	}
}

interface ResultsWithSource {
	results: Results;
	code: string;
	sourceMap: string;
	filePath: string;
}

const envVarsDefinitions = {
	"process.env.NODE_ENV": '"development"',
	...getEnvVarsDefinitions(),
};

function resolveInjects(config: DevScriptsConfig): string[] {
	if (config.framework === "react") {
		return [path.resolve(__dirname, "../react-shim.js")];
	}

	return [];
}

const esbuildOptions: esbuild.BuildOptions = {
	sourcemap: "inline",
	define: envVarsDefinitions,
	inject: resolveInjects(config),
	bundle: true,
	color: true,
	write: false,
	format: "esm",
	incremental: true,
	logLevel: "error",
	platform: "node",
	external: ["source-map-support"],
};

async function buildFile(file: string): Promise<{ buildResult: esbuild.BuildResult; originalCode: string }> {
	return new Promise((resolve, reject) => {
		fs.readFile(file, (err, data) => {
			if (err) {
				reject(err);
				return;
			}
			const originalCode = data.toString("utf8");
			const code = `
			${originalCode}
			run();
			getResults();
			`;

			esbuild
				.build({
					...esbuildOptions,
					stdin: { contents: code, resolveDir: path.dirname(file), sourcefile: file, loader: "tsx" },
				})
				.then((buildResult) => {
					resolve({ buildResult, originalCode });
				})
				.catch(reject);
		});
	});
}

function suiteHasFailedTest(suiteResults: SuiteResults): boolean {
	return Object.values(suiteResults).some((testResult) => testResult.passed === false);
}

async function printTestReport(allResults: ResultsWithSource[]): Promise<void> {
	const suites = { total: 0, failed: 0 };
	const tests = { total: 0, failed: 0 };
	let totalTime = 0;
	for (const { filePath, code, sourceMap, results } of allResults) {
		const suitesNo = Object.keys(results).length;
		suites.total = suites.total + suitesNo;

		for (const [suiteName, suiteResults] of Object.entries(results)) {
			const testsNo = Object.keys(suiteResults).length;
			tests.total = tests.total + testsNo;
			const testEntries = Object.entries(suiteResults);
			for (const [, testResult] of testEntries) {
				totalTime += getMillisecondsFromHrTime(testResult.time);
			}

			if (suiteHasFailedTest(suiteResults)) {
				suites.failed = suites.failed + 1;

				console.log(
					`${chalk.bgRed.black(" FAIL ")} ${chalk.dim(path.relative(process.cwd(), path.dirname(filePath)) + "/")}${chalk.white(
						path.basename(filePath)
					)}`
				);

				console.log(`  ${chalk.white(suiteName)}`);
				for (const [testName, testResult] of testEntries) {
					console.log(
						`    ${testResult.passed ? chalk.green(figures.tick) : chalk.red(figures.cross)} ${chalk.dim(
							`${testName} (${formatTestDuration(testResult.time)})`
						)}`
					);

					if (!testResult.passed) {
						tests.failed = tests.failed + 1;
					}
				}

				for (const [testName, testResult] of testEntries) {
					if (!testResult.passed) {
						console.log("");
						console.log(`  ${chalk.red(`● ${suiteName} > ${testName}`)}`);
						console.log("");
						console.log(
							padMultilineText(testResult.error.matcherResult ? testResult.error.matcherResult.message() : testResult.error.message)
						);
						console.log("");
						const codeHighlight = await showErrorOrigin(testResult.error, code, sourceMap);
						console.log(codeHighlight);
					}
				}
			}
		}
	}

	console.log(showTotalResults(suites, tests, totalTime));
}

async function test() {
	console.clear();

	const testGlob = `${srcFolder}/**/*.test.(ts|tsx|js|jsx)`;
	const srcGlob = `${srcFolder}/**/*(?!test).(ts|tsx|js|jsx)`;

	const tm = new TestMemory();

	const testFiles = await globby(testGlob);
	for (const filePath of testFiles) {
		tm.addTestFile(filePath);
	}

	async function testFile(filePath: string): Promise<ResultsWithSource | null> {
		const { buildResult, originalCode } = await buildFile(filePath);

		if (buildResult.outputFiles) {
			const codeAndSourceMap = buildResult.outputFiles[0].text;

			const sourceMap = sourceMapURL.getFrom(codeAndSourceMap);
			const code = sourceMapURL.removeFrom(codeAndSourceMap);

			const sandbox = { ...new Tester(), expect, global: {}, process: { env: {}, argv: [] }, require, argv: [] };

			const script = new vm.Script(code, {
				filename: filePath,
			});
			const context = vm.createContext(sandbox);
			try {
				return { results: script.runInContext(context) as Results, code: originalCode, sourceMap, filePath };
			} catch (error) {
				console.log(error);
				return { results: {} as Results, code: originalCode, sourceMap, filePath };
			}
		}

		return null;
	}

	async function testAll(): Promise<void> {
		const results: ResultsWithSource[] = [];
		for (const filePath of tm.testFiles) {
			const result = await testFile(filePath);
			if (result) {
				results.push(result);
			}
		}
		printTestReport(results);
	}

	chokidar.watch(srcGlob, { awaitWriteFinish: false, ignoreInitial: true, ignored: testGlob }).on("all", async (event, filePath) => {
		if (!["change", "add", "unlink"].includes(event)) {
			return;
		}
		console.clear();
		console.log(formatChokidarEvent(event, filePath));

		testAll();
	});

	chokidar.watch(testGlob, { awaitWriteFinish: false, ignoreInitial: true }).on("all", async (event, filePath) => {
		if (event === "add") {
			tm.addTestFile(filePath);
		}

		if (event === "unlink") {
			tm.removeTestFile(filePath);
		}

		if (!["change", "add"].includes(event)) {
			return;
		}
		console.clear();
		console.log(formatChokidarEvent(event, filePath));

		const result = await testFile(filePath);
		if (result) {
			printTestReport([result]);
		}
	});

	testAll();
}

test();
