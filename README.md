# unzalgo

[![Travis](https://img.shields.io/travis/kdex/unzalgo.svg?branch=master)](https://travis-ci.org/kdex/unzalgo)
[![codecov](https://codecov.io/gh/kdex/unzalgo/branch/master/graph/badge.svg)](https://codecov.io/gh/kdex/unzalgo)
[![dependencies Status](https://img.shields.io/david/kdex/unzalgo.svg)](https://david-dm.org/kdex/unzalgo)

Transforms ť͈̓̆h̏̔̐̑ì̭ͯ͞s̈́̄̑͋ into *this* without breaking internationalization.

## Installation
```bash
$ npm i -D unzalgo
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
```js
import { clean, isZalgo }  from "unzalgo";
/* Regular cleaning */
assert(clean("ť͈̓̆h̏̔̐̑ì̭ͯ͞s̈́̄̑͋") === "this");
/* Clean only if there are no "normal" characters in the word (t, h, i and s are "normal") */
assert(clean("ť͈̓̆h̏̔̐̑ì̭ͯ͞s̈́̄̑͋", 1) === "ť͈̓̆h̏̔̐̑ì̭ͯ͞s̈́̄̑͋");
/* Clean only if there is at least one combining character  */
assert(clean("français", 0) === "francais");
/* "français" is not a Zalgo text, of course */
assert(isZalgo("français") === false);
/* Unless you define the Zalgo property as containing combining characters */
assert(isZalgo("français", 0) === true);
/* You can also define the Zalgo property as consisting of nothing but combining characters */
assert(isZalgo("français", 1) === false);
```
## Threshold
Unzalgo functions accept a `threshold` option that lets you configure how sensitively `unzalgo` behaves. The number `threshold` falls between `0` and `1`. The threshold defaults to `0.55`.

A threshold of `0` indicates that a string should be classified as Zalgo text if at least **0%** of its codepoints have the Unicode category `Mn` or `Me`.

A threshold of `1` indicates that a string should be classified as Zalgo text if at least **100%** of its codepoints have the Unicode category `Mn` or `Me`.

## Exports
#### clean(string, threshold) [default export]
Removes all Zalgo text characters for every "likely Zalgo" word in `string`. Returns a representation of `string` without Zalgo text.

#### computeScores(string)
Computes a score ∈ `[0, 1]` for every word in the input string. Each score represents the ratio of Zalgo characters to total characters in a word.

#### isZalgo(string, threshold)
Returns `true` if `string` is a Zalgo text, else `false`.