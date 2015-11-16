import categories from "unicode-8.0.0/categories";
import statistics from "stats-lite";
const ZALGO_CHARACTER_CATEGORIES = ["Mn", "Me"];
const DEFAULT_THRESHOLD = 0.5;
function getCategory(string) {
	return categories[string.codePointAt()];
}
export default {
	/**
	* Determines if the string consists of zalgo text. Note that the occurrence of a combining character is not enough to trigger this method to true. Instead, it assigns a score to each word in the string and applies some statistics to the total score. Thus, internationalized strings aren't automatically classified as Zalgo text.
	* @method isZalgo
	* @param {String} string
	* A string for which a Zalgo text check is run.
	* @param {Number} threshold
	* A threshold between 0 and 1. The higher the threshold, the more extreme Zalgo text cases are allowed.
	* @return {Boolean}
	* Whether the string is a Zalgo text string.
	*/
	isZalgo(string, threshold = DEFAULT_THRESHOLD) {
		if (!string.length) {
			return false;
		}
		else {
			let wordScores = [];
			for (let word of string.normalize("NFD").split(" ")) {
				/* Compute all categories */
				let categories = [];
				for (let character of word) {
					let category = getCategory(character);
					categories.push(category);
				}
				/* Count how many of the categories are banned */
				let bannedOccurrences = [];
				for (let bannedCategory of ZALGO_CHARACTER_CATEGORIES) {
					bannedOccurrences.push(categories.filter(e => e === bannedCategory).length);
				}
				let score = bannedOccurrences.reduce((a, b) => a + b) / word.length;
				wordScores.push(score);
			}
			if (wordScores.length === 1) {
				return wordScores[0] > threshold;
			}
			else {
				let totalScore = statistics.percentile(wordScores, 0.75);
				return totalScore > threshold;
			}
		}
	},
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
	clean(string, threshold = DEFAULT_THRESHOLD) {
		let cleaned = "";
		for (let word of string.normalize("NFD").split(/( )/)) {
			if (this.isZalgo(word, threshold)) {
				for (let character of word) {
					if (!ZALGO_CHARACTER_CATEGORIES.includes(getCategory(character))) {
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
};