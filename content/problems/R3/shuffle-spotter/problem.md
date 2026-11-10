# Shuffle Spotter

A puzzle booth prints a long banner `text` and shows a short `word`. A stretch of the banner is a **shuffle** of the word when it has the same length as the word and uses exactly the same letters the same number of times, in any order (`"tea"` and `"eat"` are shuffles of each other).

Count how many positions `i` have the stretch `text[i .. i + word.length() - 1]` equal to a shuffle of `word`. Overlapping stretches all count.

## Examples

- `text = "cbaebabacd"`, `word = "abc"` gives `2` (positions 0 and 6: `"cba"` and `"bac"`).
- `text = "aaaa"`, `word = "aa"` gives `3` (the stretch at positions 0, 1 and 2).
- `text = "xyz"`, `word = "abcd"` gives `0` (the word is longer than the banner).

## Constraints

- `0 <= text.length() <= 100000`
- `1 <= word.length() <= 100000`
- Both strings contain only `a` to `z`.
