/* eslint-env node */
/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	rules: {
		"@typescript-eslint/explicit-module-boundary-types": "off",
	},
};
