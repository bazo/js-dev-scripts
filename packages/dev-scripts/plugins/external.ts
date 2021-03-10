/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Plugin, PluginBuild } from "esbuild";

const externalFiles = ["png", "svg", "eot", "woff", "woff2", "ttf", "jpg", "jpeg"];

const filter = new RegExp(`[\S/]*\.(${externalFiles.join("|")})[\S/]*`);

const externalPlugin = (): Plugin => ({
	name: "external",
	setup: function (build: PluginBuild) {
		build.onResolve({ filter, namespace: "file" }, async (args) => {
			//console.log({ args });
			return {
				external: true,
			};
		});
	},
});

export default externalPlugin;
