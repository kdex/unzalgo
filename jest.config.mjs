import { defaults } from "jest-config";
export default {
	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.mjs"],
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.mjs$",
	transform: {
		"\\.mjs$": "babel-jest"
	},
	moduleFileExtensions: [...defaults.moduleFileExtensions, "mjs"]
};