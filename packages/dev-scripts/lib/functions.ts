/* eslint-disable @typescript-eslint/ban-ts-comment */
import { GrammarItem } from "@aivenio/tsc-output-parser";
import chalk from "chalk";
import { LintResults, Message } from "./types";
import * as path from "path";
import { SourceMapConsumer, NullableMappedPosition } from "source-map";
import { highlight } from "cli-highlight";
import figures from "figures";
import prettyMilliseconds from "pretty-ms";
import convertHrtime, { HRTime } from "convert-hrtime";
import { hrtime } from "process";

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

export function padMultilineText(text: string, indent = 4): string {
	const lines = text.split("\n");
	return lines.map((line) => line.padStart(indent + line.length, " ")).join("\n");
}

async function getOriginalPosition(error: Error, sourceMap: string): Promise<NullableMappedPosition> {
	const linesAndColumns = error.stack?.match(/at [\/\w\.\_\s()-]*:(\d+:\d+)/);
	let line: number | null = null;
	let column: number | null = null;
	if (linesAndColumns) {
		[line, column] = linesAndColumns[1].split(":").map((numString) => parseInt(numString));
	}

	const json = Buffer.from(sourceMap.substring(29), "base64").toString();
	const rawSourceMap = JSON.parse(json);

	return SourceMapConsumer.with(rawSourceMap, null, (consumer) => {
		return consumer.originalPositionFor({
			line: line as number,
			column: column as number,
		});
	});
}

export async function showErrorOrigin(error: Error, code: string, sourceMap: string): Promise<string> {
	const originalPosition = await getOriginalPosition(error, sourceMap);

	const lines = code.split("\n");

	const start = Math.max(0, (originalPosition.line as number) - 5);
	const end = (originalPosition.line as number) + 5;
	let linesToShow = lines.slice(start, end);

	const highlightedLines = highlight(linesToShow.join("\n"), {
		language: "ts",
		theme: {
			string: chalk.green,
			number: chalk.magenta,
			keyword: chalk.cyan,
		},
	}).split("\n");

	linesToShow = [];

	for (let index = 0; index < highlightedLines.length; index++) {
		const line = highlightedLines[index];

		if (start + index === (originalPosition.line as number) - 2) {
			const prefix = `${chalk.red(figures.pointer)} ${start + index + 1} | `.padStart(20, " ");
			linesToShow.push(`${chalk.dim(prefix)} ${chalk.dim(line)}`);
			const prefix2 = `| `.padStart(10, " ");
			linesToShow.push(`${chalk.dim(prefix2)} ${chalk.red("^").padStart((originalPosition.column as number) + 20 + 2, " ")}`);
		} else {
			const prefix = `${start + index + 1} | `.padStart(10, " ");
			linesToShow.push(`${chalk.dim(prefix)} ${line}`);
		}
	}

	linesToShow.push("");

	return linesToShow.join("\n");
}

export function showTotalResults(suites = { total: 0, failed: 0 }, tests = { total: 0, failed: 0 }, totalTime = 0): string {
	const header = (text: string): string => {
		return chalk.white(text.padEnd(12, " "));
	};

	return [
		`${header("Test Suites:")} ${suites.failed ? `${chalk.red(`${suites.failed} failed`)}, ` : ""}${
			suites.total - suites.failed > 0 ? `${chalk.green(`${suites.total - suites.failed} passed`)}, ` : ""
		}${suites.total} total`.trim(),
		`${header("Tests:")} ${tests.failed ? `${chalk.red(`${tests.failed} failed`)}, ` : ""}${
			tests.total - tests.failed > 0 ? `${chalk.green(`${tests.total - tests.failed} passed`)}, ` : ""
		}${tests.total} total`.trim(),
		`${header("Time:")} ${formatMilliseconds(totalTime)}`.trim(),
	].join("\n");
}

export function getMillisecondsFromHrTime(hrTime: [number, number]): number {
	return convertHrtime(hrTime).milliseconds;
}

export function formatMilliseconds(milliseconds: number): string {
	return prettyMilliseconds(milliseconds, {
		millisecondsDecimalDigits: 4,
	});
}

export function formatTestDuration(hrTime: [number, number]): string {
	return formatMilliseconds(getMillisecondsFromHrTime(hrTime));
}
