import { clean, isZalgo, computeScores } from "../src";
const expectClean = (text, expected, ...args) => expect(clean(text, ...args)).toBe(expected);
const expectZalgoConditional = (text, condition) => expect(isZalgo(text)).toBe(condition);
const expectZalgo = text => expectZalgoConditional(text, true);
const expectNoZalgo = text => expectZalgoConditional(text, false);
const expectScores = (text, expected) => expect(computeScores(text)).toEqual(expected);
const compose = text => text.normalize("NFC");
test("Empty string", () => {
	const text = "";
	expectScores(text, [
		0 / 1
	]);
	expectClean(text, text);
	expectNoZalgo(text);
});
test("Single ASCII character", () => {
	const text = "x";
	expectScores(text, [
		0 / 1
	]);
	expectClean(text, text);
	expectNoZalgo(text);
});
test("Evil user input", () => {
	const text = "T͘H͈̩I͏̼S͇̬ ́E̬̕V̙I̧͖L͇͍ ̺̮U͝S̞͝E͚͝R IṊ͞P̫Ù̹T̜͝";
	expectScores(text, [
		7 / 11,
		8 / 12,
		7 / 11,
		7 / 12
	]);
	expectClean(text, "THIS EVIL USER INPUT");
	expectZalgo(text);
});
test("Clean only half of evil user input", () => {
	const text = "S̷̡̡̡̱̦̣̹̭̻͔̣͖̤̜̮̓̒̋̋͌̄̊̄̎̓o̷̡̢̨̗͔̤̫͙̖̙͉̲̘͙͔͖̤͎̙͓̳̣̳̣͋̀̇́̈̏̾̇̇̀̎̔̓̇̆͝ḿ̸̨̮̟̣̙̮̲̭͎͓͖̘̒̀͌͆͊̿̾̄̽̀̔̈́̍̒͒̔̕͝e̷̛͖̤͍̬͖̔̈̆̐͌̃̓͌̽͑̾̐̇̑̇̈̂̋̂͠ ̵̢̨̞͕̥̯̼͈̺̖̞̥̳̤̓̇̓̓̈͆z̷̡̬̱̺̘̹̭̙̭͚̼̝̤̳̦̲̬̜͌͌̊̆ͅͅa̷̢̡̺͕͈̰̮̲͔̙̱̼͉̲̼̝̝̻̹̱̹̝̗̿̋͐̊͑͑͐̽̆̉̓͋̽̅̈́̚͜͝l̶͇͍͈̞̠̜͕͒̑͆̇̊̚͝g̸̨̛͎͚͚̗̘͙͔͓̠̝͔̬̳̗̯̮͍̻̥̃͊̏̐̌͒̀̓͛͠ȭ̷̢̡̧̤͇̮͕̘̱̬̖̪͈̘̟̉͑͌̑̿̇̊̿͛͊̎͌̀̽͛͋̃̑́̈́̈́̅͠ ̷̛͙͙̜̫̼̙̯́̉̊̿̈́́̽͛̓̓̊̓̋̏̀͌͠ͅt̷̠̞̯̤̃̇̒̾͒̑͋̒̈́͋͗̉̉͐̍̾͑̈́̈́͌͆̀̂̋͌͜ȩ̶̧̢̡̛̛̣͕̥͕͇̖͈̗͍̖̠͚̮͙̅̂̌́̐͛͗̽͋́̿͂̅̒͌̐͆̏̕͜͝͝͝͠x̶̡̧̛͚̗̖̙͚͍̻̙̥͓͖͕͍̮͖̙̙̜͓͈̩̯̐͛̏̍́͌̏̂̀̐͛͂̈́̆́̀̒̉̾̈́͌͘͜͠t̸̨̨̲̟͎̩̱̹̬͙̩̠͇̪͒̃̒͛̍̎̂͒̀́́̍.̵̮͐̋̐͐̅̿̿́̊͑́̂͗͂̊̽̚̕̕͘̕͘͠";
	expectClean(text, "Somê̋̂͠ zalgó̈́̅͠ text.̕͘̕͘͠", {
		targetDensity: 0.5
	});
});
test("Some diacritics", () => {
	const text = "having thiŝ te̅xt displây normally, since some lângûaĝes aĉtuallŷ uŝe thêse sŷmbo̅ls";
	expectScores(text, [
		0 / 6,
		1 / 5,
		1 / 5,
		1 / 8,
		0 / 9,
		0 / 5,
		0 / 4,
		3 / 12,
		2 / 10,
		1 / 4,
		1 / 6,
		2 / 9
	]);
	expectClean(text, compose(text));
	expectNoZalgo(text);
	expectClean(text, "having this text display normally, since some languages actually use these symbols", {
		detectionThreshold: 0
	});
});
test("Vietnamese", () => {
	const text = "được";
	expectScores(text, [
		3 / 7
	]);
	expectClean(text, compose(text));
	expectNoZalgo(text);
});
test("Czech pangram", () => {
	const text = "Z nich ovšem pouze předposlední sdílí s výše uvedenou větou příliš žluťoučký kůň úpěl ďábelské ódy vlastnost, že každé písmeno s diakritikou se vyskytuje právě jednou. Nahradíme-li například příliš za příšerně, písmeno Ě se vyskytne dvakrát (již je obsaženo v úpěl), což může být pro některé účely nevhodné.";
	expectScores(text, [
		0 / 1,
		0 / 4,
		1 / 6,
		0 / 5,
		2 / 14,
		2 / 7,
		0 / 1,
		2 / 6,
		0 / 8,
		1 / 6,
		3 / 9,
		4 / 13,
		2 / 5,
		2 / 6,
		3 / 11,
		1 / 4,
		0 / 9,
		1 / 3,
		2 / 7,
		1 / 8,
		0 / 1,
		0 / 11,
		0 / 2,
		0 / 9,
		2 / 7,
		0 / 7,
		1 / 13,
		2 / 11,
		3 / 9,
		0 / 2,
		4 / 13,
		1 / 8,
		1 / 2,
		0 / 2,
		0 / 8,
		1 / 8,
		1 / 5,
		0 / 2,
		1 / 9,
		0 / 1,
		2 / 8,
		1 / 4,
		2 / 6,
		1 / 4,
		0 / 3,
		2 / 9,
		2 / 7,
		1 / 10
	]);
	expectClean(text, compose(text));
	expectNoZalgo(text);
});
test("Zalgo word", () => {
	const text = "E̬̬͈̮̻̕V҉̙I̧͖̜̹̩̞̱L͇͍̝";
	expectScores(text, [
		18 / 22
	]);
	expectClean(text, "EVIL");
	expectZalgo(text);
});
test("The word `français` remains unchanged by default", () => {
	const text = "français";
	expectClean(text, "français");
});
test("The word `français` changes with a threshold of `0`", () => {
	const text = "français";
	expectClean(text, "francais", {
		detectionThreshold: 0
	});
});
test("Zalgo sentence", () => {
	const text = "Ṱ̶̘̱̞̩̘̳̫̠͖̖̭̪ͣ̓̆̅̾̋̂ͨ͝h̡̢̲̻̮̖̤̼͉͕̯͎͔̖̘̮̠̟̠͛̎́̔̃̉ͭ̆ͥ͜i̡̛͙͓̞̜̩ͯͮͮ̾̓̄̽͋͒͌͊̔ͯ̃̂̓ͣ͒̚ͅͅs̴̹̙̠̹̱̹͑̐̀ͨ̍ͫ͋̿̓̿͞ ̶̷̧͖̯̘̭̩̯͍̲̳̝̫͇̥͙͉̟̘̲͎̾ͥ̓ͭͯ̐ͭ̒̂̄ͦ͐̀i̶͎͕̱̤̭̦̙̞̙̰̲͙̽͗̏ͯͭ̃̉͗̀͘͝͞ş̥̭͕͇̰͉̺̬̣̜ͨͣ̈̂̈̏̿̒͋̊̿̃́ͣ̈̀ͅ ̵̵̲̖̩͚͚̹̥͔͚̼̠̙̬͍͈̇̿ͬͥͣ̍̐ͤ̊ͅZ̷̊̈́͌̌̀͢͝҉̭̯͇̪͖̫̩̖͢a̻̤̯͔̯͉͎̟͚̍̾̅ͨͥ̊̽̿̎̐͌̇̋ͫ̆ͭͣ̆́͘͡l̶̬͓̞̮͇̜̻̳̲̱̺̂͐ͯ͒͋̏̃̅̿ͧ͒͆ͫ̏̾́̀̚͠ģ̡̯̝̻͖̼͚ͮͬ̎ͨ̔̊̎̑̑̽̅̍͘͟o̸͎̤͕̺̞̙͕̗̒́̌̏͂͊͑̕͞͠ ̴̡͐̈́͋͑̏ͤͦ͌̌͌́̎̽̇ͫ̎́̿̔͡͏̦̻̹̫̘̟͔t̸̂́̽ͮͦ͋͐̇̑̄̊͋ͣ̈́ͨ͛̇̏͡҉̮͕͕̫͓̥͖̼ẽ̊ͭ̉͌̔̓͘͏̤̟͕̟͚̦̞̩̦̤͎͖̭͢x̆̓͆̋͋͊̌̈̒ͩ̍ͬͮͣ͟͠҉͙̦̪̫͈͞ţ̴̛̩̺̳͖̺̽͗ͧ̿ͯ̃͊͆ͪ̾͊̓͜.̛̦̩̻͉͉̠̖̗̻̻̳̽ͧͬ̃̿͘͠";
	expectScores(text, [
		98 / 102,
		88 / 90,
		148 / 153,
		147 / 152
	]);
	expectClean(text, "This is Zalgo text.");
	expectZalgo(text);
});