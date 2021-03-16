export function showErrorOrigin(lines: string[], line: number): string {
	const start = Math.max(0, (line as number) - 5);
	const end = (line as number) + 5;
	let linesToShow = lines.slice(start, end);

	const highlightedLines = linesToShow;

	const spacer = `@`;

	linesToShow = [];
	for (let index = 0; index < highlightedLines.length; index++) {
		const row = highlightedLines[index];

		if (start + index === line - 1) {
			const prefix = `> ${start + index + 1} | `.padStart(10, spacer);
			linesToShow.push(`${prefix} ${row}`);
			//const prefix2 = `| `.padStart(10, spacer);
			//linesToShow.push(`${prefix2} ${"^".padStart((originalPosition.column as number) + 15 + 2, spacer)}`);
		} else {
			const prefix = `${start + index + 1} | `.padStart(10, spacer);
			linesToShow.push(`${prefix} ${row}`);
		}
	}

	return linesToShow.join("\n");
}
