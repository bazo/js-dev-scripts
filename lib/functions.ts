import { GrammarItem } from "@aivenio/tsc-output-parser";
import chalk from "chalk";
import { LintResults, Message } from "./types";
import * as path from "path";

export function formatChokidarEvent(eventName: "add" | "addDir" | "change" | "unlink" | "unlinkDir", path: string): string {
	switch (eventName) {
		case "add":
			return `File ${chalk.green(path)} added`;

		case "change":
			return `File ${chalk.green(path)} changed`;

		case "unlink": {
			return `File ${chalk.green(path)} removed`;
		}
		default:
			return "";
	}
}

export function createMessage(event: Message["event"], data?: Message["data"]): string {
	return JSON.stringify({ event, data });
}

export function clearConsole(): void {
	process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
}

export function processLintResult({ results = [] }: LintResults): void {
	if (results.length > 0) {
		console.log("\n");
		results.forEach((result) => {
			if (result.messages.length > 0) {
				const header = `${chalk.bgWhite.black(path.relative(process.cwd(), result.filePath))} \n`;
				const messages = result.messages.map((message) => {
					return `${chalk.bold(`    Line ${message.line}:${message.column}:`)}  ${message.message} ${
						message.severity === 1 ? chalk.underline.yellow(message.ruleId) : chalk.underline.red(message.ruleId)
					}\n`;
				});
				console.log(`${header}${messages.join("")}`);
			}
		});
	}
}

export function processTscLintResult(results: GrammarItem[]): void {
	if (results.length > 0) {
		console.log("\n");
		results.forEach(({ value: result }) => {
			const header = `${chalk.bgWhite.black(path.relative(process.cwd(), result.path.value))} \n`;
			const message = `${chalk.bold(
				`    Line ${result.cursor.value.line}:${result.cursor.value.col}:`
			)}  ${result.message.value.trim()} ${chalk.underline.red(result.tsError.value.errorString)}\n`;
			console.log(`${header}${message}`);
		});
	}
}

export function prefix(text: "build" | "eslint" | "typescript"): string {
	return `[${chalk.bold(text.toUpperCase())}]:`;
}
