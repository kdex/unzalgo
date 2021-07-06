# unzalgo

[![build](https://github.com/kdex/unzalgo/workflows/build/badge.svg)](https://github.com/kdex/unzalgo/actions)
[![codecov](https://codecov.io/gh/kdex/unzalgo/branch/master/graph/badge.svg)](https://codecov.io/gh/kdex/unzalgo)
[![dependency Status](https://img.shields.io/david/kdex/unzalgo.svg)](https://david-dm.org/kdex/unzalgo)

Transforms ť͈̓̆h̏̔̐̑ì̭ͯ͞s̈́̄̑͋ into *this* without breaking internationalization.

## Installation
```bash
$ npm install unzalgo
```
## About
You can use unzalgo to both detect Zalgo text and transform it back into normal text without breaking internationalization. For example, you could transform:
```
T͘H͈̩̬̺̩̭͇I͏̼̪͚̪͚S͇̬̺ ́E̬̬͈̮̻̕V҉̙I̧͖̜̹̩̞̱L͇͍̝ ̺̮̟̙̘͎U͝S̞̫̞͝E͚̘͝R IṊ͍̬͞P̫Ù̹̳̝͓̙̙T̜͕̺̺̳̘͝
```
into
```
THIS EVIL USER INPUT
```
while also keeping
```
thiŝ te̅xt unchanged, since some lângûaĝes aĉtuallŷ uŝe thêse sŷmbo̅ls,
```
and, at the same time, keep all diacritics in
```
Z nich ovšem pouze předposlední sdílí s výše uvedenou větou příliš žluťoučký kůň úpěl […]
```
which remains unchanged after a transformation.

## Is there a demo?
Yes! You can check it out [here](https://github.kdex.de/unzalgo/). You can edit the text at the top; the lower part shows the text after `clean` using the default threshold.

## How does it work?
In Unicode, every character is assigned to a [character category](http://www.unicode.org/reports/tr49/Categories.txt). Zalgo text uses characters that belong to the categories `Mn (Mark, Nonspacing)` or `Me (Mark, Enclosing)`.

First, the text is divided into words; each word is then assigned to a score that corresponds to the usage of the categories above, combined with small use of statistics. If the score exceeds a threshold, we're able to detect Zalgo text (which allows us to strip away all characters from the above categories).

## Getting started
### Regular cleaning
```js
import { clean } from "unzalgo";
assert("this" === clean("ť͈̓̆h̏̔̐̑ì̭ͯ͞s̈́̄̑͋"));
```
### Configuring detection
```js
import { clean } from "unzalgo";
/* Clean only if there are no "normal" characters in the word (t, h, i and s are "normal") */
assert("ť͈̓̆h̏̔̐̑ì̭ͯ͞s̈́̄̑͋" === clean("ť͈̓̆h̏̔̐̑ì̭ͯ͞s̈́̄̑͋", {
	thresholds: {
		detection: 1
	}
}));
```
```js
/* Clean only if there is at least one combining character */
import { clean } from "unzalgo";
assert("francais" === clean("français", {
	thresholds: {
		detection: 0
	}
}));
```
```js
import { clean } from "unzalgo";
/* `français` remains intact by default */
assert("français" === clean("français"));
```
### Internationalization
```js
import { isZalgo } from "unzalgo";
/* "français" is not a Zalgo text, of course */
assert(isZalgo("français") === false);
```
```js
import { isZalgo } from "unzalgo";
/* Unless you define the Zalgo property as containing combining characters */
assert(isZalgo("français", 0) === true);
```
```js
import { isZalgo } from "unzalgo";
/* You can also define the Zalgo property as consisting of nothing but combining characters */
assert(isZalgo("français", 1) === false);
```
## Detection threshold
Some of this library's functions accept a `detectionThreshold` option that let you configure how sensitively `unzalgo` behaves. The number `detectionThreshold` is a number from `0` to `1` and defaults to `0.55`.

A detection threshold of `0` indicates that a string should be classified as Zalgo text if at least **0 %** of its codepoints have the Unicode category `Mn` or `Me`.

A detection threshold of `1` indicates that a string should be classified as Zalgo text if at least **100 %** of its codepoints have the Unicode category `Mn` or `Me`.

## Exports
#### clean(string[, options]): string [default export]
Removes all combining characters for every word in a string if the word is classified as Zalgo text.
If `targetDensity` is specified, not all the Zalgo characters will be removed. Instead, they will be thinned out uniformly.

Returns a cleaned, more readable string.

Arguments:
- `string: string`
A string for which combining characters are removed for every word whose Zalgo property is met.
- `options: object`
An object of options.
- `options.detectionThreshold: number = 0.55`
A threshold ∈ [0, 1]. The higher the threshold, the more combining characters are needed for it to be detected as Zalgo text.
- `options.targetDensity: number = 0`
A threshold ∈ [0, 1]. The higher the density, the more Zalgo characters will be part of the resulting string. The result is guaranteed to have a Zalgo-character density that is less than or equal to the one provided. A target density of `0` indicates that none of the combining characters should be part of the resulting string. A target density of `1` indicates that all combining characters should be part of the resulting string.
#### computeScores(string): number[]
Computes a score ∈ `[0, 1]` for every word in the input string. Each score represents the ratio of Zalgo characters to total characters in a word.

Returns An array of scores where each score describes the Zalgo ratio of a word.

Arguments:
- `string: string`
The input string for which to compute scores.
#### isZalgo(string[, detectionThreshold = 0.55]): boolean
Determines if the string consists of Zalgo text. Note that the occurrence of a combining character is not enough to trigger the detection. Instead, it computes a ratio for the input string and checks if it exceeds a given threshold. Thus, internationalized strings aren't automatically classified as Zalgo text.

Returns whether the string is a Zalgo text string.

Arguments:

- `string: string`
A string for which a Zalgo text check is run.
- `detectionThreshold: number = 0.55`
A threshold ∈ [0, 1]. The higher the threshold, the more combining characters are needed for it to be detected as Zalgo text.