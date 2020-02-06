declare module 'unzalgo' {
  /**
   * Computes a score ∈ [0, 1] for every word in the input string.
   * Each score represents the ratio  of Zalgo characters to total characters in a word.
   *
   * @param {string} string The input string for which to compute scores.
   * @return {number[]} An array of scores where each score describes the Zalgo ratio of a word.
   */
  export const computeScores: (string: string) => number[];

  /**
   * Determines if the string consists of Zalgo text. Note that the occurrence of a combining
   * character is not enough to trigger this method to `true`. Instead, it computes a ratio for
   * the input string and checks if it exceeds a given threshold. Thus, internationalized strings
   * aren't automatically classified as Zalgo text.
   *
   * @param {string} string A string for which a Zalgo text check is run.
   * @param {number} threshold A threshold ∈ [0, 1]. The higher the threshold, the more extreme
   * Zalgo text cases are allowed. Default is 0.55;
   * @return {boolean}- Whether the string is a Zalgo text string.
   */
  export const isZalgo: (text: string, threshold?: number) => boolean;

  /**
   * Removes all Zalgo text characters for every word in a string if the word is Zalgo text.
   *
   * @param {string} string A string for which Zalgo text characters are removed for every word
   * whose Zalgo property is met.
   * @param {number} [threshold=DEFAULT_THRESHOLD] A threshold between 0 and 1. The higher the
   * threshold, the more extreme Zalgo text cases are allowed. Default is 0.55
   * @return {string} A cleaned, readable string.
   */
  export const clean: (text: string, threshold?: number) => string;

  export default clean;
}
