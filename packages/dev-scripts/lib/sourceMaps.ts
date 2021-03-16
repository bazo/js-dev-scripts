/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NullableMappedPosition, SourceMapConsumerConstructor } from "source-map";
//@ts-ignore
import sourceMapURL from "source-map-url";

const sourceMapConsumer: SourceMapConsumerConstructor = require("source-map/lib/source-map-consumer").SourceMapConsumer;

export async function getOriginalPosition(error: Error, sourceMap: string): Promise<NullableMappedPosition> {
	// eslint-disable-next-line no-useless-escape
	const linesAndColumns = error.stack?.match(/at [\/\w\.\_\s()-]*:(\d+:\d+)/);
	let line: number | null = null;
	let column: number | null = null;
	if (linesAndColumns) {
		[line, column] = linesAndColumns[1].split(":").map((numString) => parseInt(numString));
	}

	const json = Buffer.from(sourceMap.substring(29), "base64").toString();
	const rawSourceMap = JSON.parse(json);

	return sourceMapConsumer.with(rawSourceMap, null, (consumer) => {
		return consumer.originalPositionFor({
			line: line as number,
			column: column as number,
		});
	});
}

export async function getOriginalPositionAndSource(line: number, column: number, sourceMap: string): Promise<NullableMappedPosition> {
	const json = Buffer.from(sourceMap.substring(29), "base64").toString();
	const rawSourceMap = JSON.parse(json);

	return sourceMapConsumer.with(rawSourceMap, null, (consumer) => {
		const originalPosition = consumer.originalPositionFor({
			line: line as number,
			column: column as number,
		});

		console.log(originalPosition);

		//consumer.sourceContentFor()

		return originalPosition;
	});
}

export function extractSourceMapURLFromSource(source: string): string {
	return sourceMapURL.getFrom(source);
}
