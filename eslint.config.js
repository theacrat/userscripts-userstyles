// eslint.config.js
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";
import js from "@eslint/js";

/** @type { import("eslint").Linter.Config[] } */
export default [
	js.configs.recommended,
	eslintConfigPrettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.greasemonkey,
			},
		},
	},
];
