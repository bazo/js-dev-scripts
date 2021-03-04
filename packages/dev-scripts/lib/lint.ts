import { ESLint } from "eslint";
import execa from "execa";
import { LintResults } from "./types";
import { GrammarItem, parse } from "@aivenio/tsc-output-parser";
import { prefix } from "./functions";
import chalk from "chalk";

const eslint = new ESLint({
	useEslintrc: true,
});

export async function lintFile(path: string): Promise<LintResults> {
	try {
		const results = await eslint.lintFiles(path);

		const { errorCount, warningCount } = results.reduce(
			(previous, current) => {
				return {
					errorCount: previous.errorCount + current.errorCount,
					warningCount: previous.warningCount + current.warningCount,
				};
			},
			{ errorCount: 0, warningCount: 0 }
		);
		return { errorCount, warningCount, results };
	} catch (error) {
		console.clear();
		console.log(
			`${chalk.red(prefix("eslint"))} ${error.message} (${chalk.dim(error.messageTemplate)}). \n          Check if you have eslintrc file in root.\n`
		);
		process.exit();
	}
}

export async function tscLint(args: string[] = [], isDev = false): Promise<GrammarItem[]> {
	try {
		await execa.command(`tsc ${args ? args : ""} --noEmit ${isDev ? "--watch" : ""}`, {
			//env: npmRunPath.env(),
			extendEnv: true,
			windowsHide: false,
			cwd: process.cwd(),
		});

		return [];
	} catch (error) {
		return parse(error.stdout) as GrammarItem[];
	}
	/*
	return new Promise((resolve, reject) => {
		const workerPromise = execa.command(`tsc ${args ? args : ""} --noEmit ${isDev ? "--watch" : ""}`, {
			//env: npmRunPath.env(),
			extendEnv: true,
			windowsHide: false,
			cwd: process.cwd(),
		});

		const { stdout, stderr } = workerPromise;
		function dataListener(chunk: any) {
			let stdOutput = chunk.toString();
			// In --watch mode, handle the "clear" character
			if (stdOutput.includes("\u001bc") || stdOutput.includes("\x1Bc")) {
				// eslint-disable-next-line no-control-regex
				stdOutput = stdOutput.replace(/\x1Bc/, "").replace(/\u001bc/, "");
			}
			resolve(stdOutput);
		}
		stdout && stdout.on("data", dataListener);
		stderr && stderr.on("data", dataListener);
		workerPromise.catch((err) => {
			if (/ENOENT/.test(err.message)) {
				reject(`"tsc" run failed. Is typescript installed in your project?`);
			}
		});
	});
	*/
}
