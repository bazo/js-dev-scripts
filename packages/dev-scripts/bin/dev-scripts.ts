#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Copyright (c) 2021-present, Martin Bazik
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.__DEV_SCRIPTS_MODE === "development") {
	require("pretty-error").start();
}
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
	throw err;
});

const spawn = require("cross-spawn");
const path = require("path");

const args = process.argv.slice(2);

const scriptIndex = args.findIndex((x) => x === "build" || x === "start" || x === "test");
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
let nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

let execPath = "node";

const fileExt = process.env.FILE_EXT || "ts";

/* @__PURE__ */
if (process.env.__DEV_SCRIPTS_MODE === "development") {
	execPath = path.resolve(__dirname, "../node_modules/.bin/ts-node-script");
	if (script === "start") {
		execPath = path.resolve(__dirname, "../node_modules/.bin/ts-node-dev");
		nodeArgs = nodeArgs.concat([
			"--enable-source-maps",
			"--script-mode",
			"--rs",
			"--exit-child",
			"--clear" /*`--watch ${path.resolve(__dirname, "../dev/dev.js")}`*/,
		]);
	}
}

if (["build", "start", "test"].includes(script)) {
	nodeArgs = nodeArgs.concat(require.resolve(`../scripts/${script}.${fileExt}`)).concat(args.slice(scriptIndex + 1));
	const result = spawn.sync(execPath, nodeArgs, {
		stdio: "inherit",
	});
	if (result.signal) {
		if (result.signal === "SIGKILL") {
			console.log(
				"The build failed because the process exited too early. " +
					"This probably means the system ran out of memory or someone called " +
					"`kill -9` on the process."
			);
		} else if (result.signal === "SIGTERM") {
			console.log(
				"The build failed because the process exited too early. " +
					"Someone might have called `kill` or `killall`, or the system could " +
					"be shutting down."
			);
		}
		process.exit(1);
	}
	process.exit(result.status);
} else {
	console.log('Unknown script "' + script + '".');
	console.log("Perhaps you need to update dev-scripts?");
}
