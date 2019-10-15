module.exports = {
	comments: false,
	presets: [
		["@babel/preset-env", {
			"targets": {
				"node": "current"
			}
		}],
		"babel-preset-minify"
	],
	plugins: [
		["@babel/plugin-proposal-unicode-property-regex", {
			useUnicodeFlag: true
		}]
	]
};