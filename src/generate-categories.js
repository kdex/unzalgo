import Mn from "unicode-9.0.0/General_Category/Nonspacing_Mark/symbols";
import Me from "unicode-9.0.0/General_Category/Enclosing_Mark/symbols";
import regenerate from "regenerate";
import { writeFileSync } from "fs";
const codePoints = regenerate().add(Mn).add(Me);
const data = codePoints.toString();
writeFileSync(`${__dirname}/categories.js`, `export default /${data}/`);