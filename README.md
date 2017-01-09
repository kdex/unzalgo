# unzalgo
Transforms ť͈̓̆h̏̔̐̑ì̭ͯ͞s̈́̄̑͋ into *this* without breaking internationalization.
## Installation
```bash
$ npm install -D unzalgo
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
while also having
```
thiŝ te̅xt displây normally, since some lângûaĝes aĉtuallŷ uŝe thêse sŷmbo̅ls,
```
and, at the same time, keep all diacritics in
```
Z nich ovšem pouze předposlední sdílí s výše uvedenou větou příliš žluťoučký kůň úpěl […]
```
which remains unchanged after a transformation.
## Is there a demo?
Yes! You can check it out [here](https://kdex.github.io/unzalgo/). You can edit the text at the top; the lower part shows the text after `Unzalgo.prototype.clean` using the default threshold.
## How does it work?
By the laws of Unicode, every Unicode character is assigned to one [character category](http://www.unicode.org/reports/tr49/Categories.txt). Zalgo text uses characters that belong to the `Mn` and `Me` category.

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
## API reference
#### Unzalgo.prototype.isZalgo(string, threshold)
Determines if the string `string` consists of Zalgo text using the threshold `threshold` to assist classification. The number `threshold` falls between `0` and `1`.

A threshold of `0` indicates that the string should be classified as Zalgo text if it contains at least **one** `Mn` or `Me` category Unicode codepoints. A threshold of `1` indicates that **all** codepoints in `string` must either be categorized as `Mn` or `Me`. The threshold defaults to `0.5`.

Returns `true` if `string` is a Zalgo text, else `false`.
#### Unzalgo.prototype.clean(string, threshold)
Removes all Zalgo text characters for every word in `string` if the word is Zalgo text. The number `threshold` falls between `0` and `1`.

A threshold of `0` indicates that a word in the string should be classified as Zalgo text if it contains at least **one** `Mn` or `Me` category Unicode codepoint. A threshold of `1` indicates that **all** codepoints in the word must either be categorized as `Mn` or `Me`. The threshold defaults to `0.5`.

Returns a representation of `string` without Zalgo text.
