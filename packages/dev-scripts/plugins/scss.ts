/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Plugin, PluginBuild } from "esbuild";
import * as fs from "fs";
import makeDir from "make-dir";
import * as path from "path";
import sass from "sass";
import * as util from "util";

const writeFile = util.promisify(fs.writeFile);

const defaultOptions = {
	plugins: [],
	rootDir: process.cwd(),
	tempDir: `${process.cwd()}/.temp`,
};

const postcssPlugin = (userOptions = {}): Plugin => ({
	name: "scss",
	setup: function (build: PluginBuild) {
		const options = { ...defaultOptions, ...userOptions };
		const { rootDir, tempDir } = options;
		build.onResolve({ filter: /.\.(scss)$/, namespace: "file" }, async (args) => {
			const sourceFullPath = path.resolve(args.resolveDir, args.path);
			const sourceExt = path.extname(sourceFullPath);
			const sourceBaseName = path.basename(sourceFullPath, sourceExt);
			const sourceDir = path.dirname(sourceFullPath);
			const sourceRelDir = path.relative(path.dirname(rootDir), sourceDir);

			const tmpDir = path.resolve(tempDir, sourceRelDir);
			const tmpFilePath = path.resolve(tmpDir, `${sourceBaseName}.css`);

			const result = sass.renderSync({
				file: sourceFullPath,
				indentType: "tab",
			});

			// Write result file
			makeDir(path.dirname(tmpFilePath));
			await writeFile(tmpFilePath, result.css);

			return {
				namespace: "file",
				path: tmpFilePath,
			};
		});
	},
});

export default postcssPlugin;
