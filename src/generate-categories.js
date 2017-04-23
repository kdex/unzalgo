import categories from "unicode-9.0.0/categories";
import { writeFile } from "fs";
const codePoints = [];
const ZALGO_CHARACTER_CATEGORIES = ["Mn", "Me"];
for (let i = 0; i < categories.length; ++i) {
	if (ZALGO_CHARACTER_CATEGORIES.includes(categories[i])) {
		codePoints.push(String.fromCodePoint(i));
	}
}
const data = JSON.stringify(codePoints);
writeFile(`${__dirname}/categories.js`, `export default ${data}`);