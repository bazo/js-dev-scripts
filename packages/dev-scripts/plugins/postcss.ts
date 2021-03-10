import * as fs from "fs";
import postcss from "postcss";
import * as util from "util";
import * as path from "path";
import { PluginBuild } from "esbuild";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const defaultOptions = {
	plugins: [],
	rootDir: process.cwd(),
	tempDir: `${process.cwd()}/.temp`,
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const postcssPlugin = (userOptions = {}) => ({
	name: "postcss",
	setup: function (build: PluginBuild) {
		const options = { ...defaultOptions, ...userOptions };
		const { rootDir, plugins, tempDir } = options;
		build.onResolve({ filter: /.\.(css)$/, namespace: "file" }, async (args) => {
			console.log("postcss plugin running")
			const sourceFullPath = path.resolve(args.resolveDir, args.path);
			const sourceExt = path.extname(sourceFullPath);
			const sourceBaseName = path.basename(sourceFullPath, sourceExt);
			const sourceDir = path.dirname(sourceFullPath);
			const sourceRelDir = path.relative(path.dirname(rootDir), sourceDir);

			const tmpDir = path.resolve(tempDir, sourceRelDir);
			const tmpFilePath = path.resolve(tmpDir, `${sourceBaseName}.css`);

			const css = await readFile(sourceFullPath);

			const result = postcss(plugins).process(css, {
				from: sourceFullPath,
				to: tmpFilePath,
			});

			// Write result file
			await writeFile(tmpFilePath, result.css);

			return {
				path: tmpFilePath,
			};
		});
	},
});

export default postcssPlugin;
