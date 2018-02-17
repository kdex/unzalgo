import statistics from "stats-lite";
const categories = /[\p{Mn}\p{Me}]+/u;
const DEFAULT_THRESHOLD = 0.5;
/**
* Determines if the string consists of Zalgo text. Note that the occurrence of a combining character is not enough to trigger this method to true. Instead, it assigns a score to each word in the string and applies some statistics to the total score. Thus, internationalized strings aren't automatically classified as Zalgo text.
* @method isZalgo
* @param {String} string
* A string for which a Zalgo text check is run.
* @param {Number} threshold
* A threshold between 0 and 1. The higher the threshold, the more extreme Zalgo text cases are allowed.
* @return {Boolean}
* Whether the string is a Zalgo text string.
*/
export function isZalgo(string, threshold = DEFAULT_THRESHOLD) {
	if (!string.length) {
		return false;
	}
	const wordScores = [];
	for (const word of string.normalize("NFD").split(" ")) {
		/* Compute all categories */
		let banned = 0;
		for (const character of word) {
			if (categories.test(character)) {
				++banned;
			}
		}
		const score = banned / word.length;
		wordScores.push(score);
	}
	if (wordScores.length === 1) {
		return wordScores[0] > threshold;
	}
	const totalScore = statistics.percentile(wordScores, 0.75);
	return totalScore > threshold;
}
/**
* Removes all Zalgo text characters for every word in a string if the word is Zalgo text.
* @method clean
* @param {String} string
* A string for which Zalgo text characters are removed for every word whose Zalgo property is met.
* @param {Number} [threshold=0.5]
* A threshold between 0 and 1. The higher the threshold, the more extreme Zalgo text cases are allowed.
* @return {String}
* A cleaned, readable string.
*/
export function clean(string, threshold = DEFAULT_THRESHOLD) {
	let cleaned = "";
	for (const word of string.normalize("NFD").split(" ")) {
		if (isZalgo(word, threshold)) {
			for (const character of word) {
				if (!categories.test(character)) {
					cleaned += character;
				}
			}
		}
		else {
			cleaned += word;
		}
	}
	return cleaned;
}
export default clean;