/** @type {import('stylelint').Config} */
export default {
	extends: ["stylelint-config-standard-less", "stylelint-config-clean-order"],
	plugins: ["stylelint-less"],
	rules: {
		"at-rule-no-vendor-prefix": [true, { ignoreAtRules: ["-moz-document"] }],
		"selector-class-pattern": "",
	},
};
