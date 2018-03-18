import { percentile } from "stats-lite";
const categories = /[\p{Mn}\p{Me}]+/u;
const DEFAULT_THRESHOLD = 0.55;
const compose = string => string.normalize("NFC");
const decompose = string => string.normalize("NFD");
/*
* Computes a score ∈ [0, 1] for every word in the input string. Each score represents the ratio of Zalgo characters to total characters in a word.
* @param {string} string
* The input string for which to compute scores.
* @return {number[]}
* An array of scores where each score describes the Zalgo ratio of a word.
*/
export const computeScores = string => {
	const wordScores = [];
	/**
	* Trimming here allows us to return early.
	* Without trimming, we risk dividing by `0` later when computing the score.
	*/
	if (!string.trim().length) {
		wordScores.push(0);
	}
	else {
		for (const word of decompose(string).split(/\s+/)) {
			let banned = 0;
			for (const character of word) {
				if (categories.test(character)) {
					++banned;
				}
			}
			const score = banned / word.length;
			wordScores.push(score);
		}
	}
	return wordScores;
};
/**
* Determines if the string consists of Zalgo text. Note that the occurrence of a combining character is not enough to trigger this method to `true`. Instead, it computes a ratio for the input string and checks if it exceeds a given threshold. Thus, internationalized strings aren't automatically classified as Zalgo text.
* @param {string} string
* A string for which a Zalgo text check is run.
* @param {number} threshold
* A threshold ∈ [0, 1]. The higher the threshold, the more extreme Zalgo text cases are allowed.
* @return {boolean}
* Whether the string is a Zalgo text string.
*/
export const isZalgo = (string, threshold = DEFAULT_THRESHOLD) => {
	const wordScores = computeScores(string);
	const totalScore = percentile(wordScores, 0.75);
	return totalScore >= threshold;
};
/**
* Removes all Zalgo text characters for every word in a string if the word is Zalgo text.
* @param {string} string
* A string for which Zalgo text characters are removed for every word whose Zalgo property is met.
* @param {number} [threshold=DEFAULT_THRESHOLD]
* A threshold between 0 and 1. The higher the threshold, the more extreme Zalgo text cases are allowed.
* @return {string}
* A cleaned, readable string.
*/
export const clean = (string, threshold = DEFAULT_THRESHOLD) => {
	let cleaned = "";
	for (const word of decompose(string).split(/(\s+)/)) {
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
	return compose(cleaned);
};
export default clean;