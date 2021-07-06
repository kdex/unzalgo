import { percentile } from "stats-lite";
const categories = /[\p{Mn}\p{Me}]+/u;
const DEFAULT_DETECTION_THRESHOLD = 0.55;
const DEFAULT_TARGET_DENSITY = 0;
const compose = string => string.normalize("NFC");
const decompose = string => string.normalize("NFD");
const computeZalgoDensity = string => [...string].filter(character => categories.test(character)).length / Math.max(string.length, 1);
const clamp = x => Math.max(Math.min(x, 1), 0);
/*
* Computes a score ∈ [0, 1] for every word in the input string. Each score represents the ratio of combining characters to total characters in a word.
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
* Determines if the string consists of Zalgo text. Note that the occurrence of a combining character is not enough to trigger the detection. Instead, it computes a ratio for the input string and checks if it exceeds a given threshold. Thus, internationalized strings aren't automatically classified as Zalgo text.
* @param {string} string
* A string for which a Zalgo text check is run.
* @param {number} detectionThreshold
* A threshold ∈ [0, 1]. The higher the threshold, the more combining characters are needed for it to be detected as Zalgo text.
* @return {boolean}
* Whether the string is a Zalgo text string.
*/
export const isZalgo = (string, detectionThreshold = DEFAULT_DETECTION_THRESHOLD) => {
	const wordScores = computeScores(string);
	const totalScore = percentile(wordScores, 0.75);
	return totalScore >= clamp(detectionThreshold);
};
/**
* Removes all combining characters for every word in a string if the word is classified as Zalgo text.
* If `targetDensity` is specified, not all the Zalgo characters will be removed. Instead, they will be thinned out uniformly.
* @param {string} string
* A string for which combining characters are removed for every word whose Zalgo property is met.
* @param {object} options
* Options for cleaning.
* @param {number} [options.detectionThreshold=DEFAULT_DETECTION_THRESHOLD]
* A threshold ∈ [0, 1]. The higher the threshold, the more combining characters are needed for it to be detected as Zalgo text.
* @param {number} [options.targetDensity=DEFAULT_TARGET_DENSITY]
* A threshold ∈ [0, 1]. The higher the density, the more Zalgo characters will be part of the resulting string. The result is guaranteed to have a Zalgo-character density that is less than or equal to the one provided.
* @return {string}
* A cleaned, more readable string.
*/
export const clean = (string, {
	detectionThreshold = DEFAULT_DETECTION_THRESHOLD,
	targetDensity = DEFAULT_TARGET_DENSITY
} = {}) => {
	let cleaned = "";
	const effectiveTargetDensity = clamp(targetDensity);
	for (const word of decompose(string).split(/(\s+)/)) {
		if (isZalgo(word, detectionThreshold)) {
			let cleanedWord = "";
			const letters = [...word].map(character => ({
				character,
				isCandidate: categories.test(character)
			}));
			for (let i = 0; i < letters.length; ++i) {
				const {
					character,
					isCandidate
				} = letters[i];
				if (isCandidate) {
					const admissionProjection = cleanedWord + word.substr(i);
					const omissionProjection = cleanedWord + word.substr(i + 1);
					const admissionDistance = effectiveTargetDensity - computeZalgoDensity(admissionProjection);
					const omissionDistance = effectiveTargetDensity - computeZalgoDensity(omissionProjection);
					if (Math.abs(omissionDistance) <= Math.abs(admissionDistance)) {
						continue;
					}
				}
				cleanedWord += character;
			}
			cleaned += cleanedWord;
		}
		else {
			cleaned += word;
		}
	}
	return compose(cleaned);
};
export default clean;