import categories from "unicode-8.0.0/categories";
import fs from "fs";
let codePoints = [];
const ZALGO_CHARACTER_CATEGORIES = ["Mn", "Me"];
for (let i = 0; i < categories.length; ++i) {
	if (ZALGO_CHARACTER_CATEGORIES.includes(categories[i])) {
		codePoints.push(String.fromCodePoint(i));
	}
}
let data = JSON.stringify(codePoints);
fs.writeFile(`${__dirname}/categories.js`, `export default ${data}`);