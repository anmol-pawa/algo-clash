# Verse Match

A poet marks the rhyme of a poem with a **pattern**: one lowercase letter per line, where equal letters mean "these lines are the same word" and different letters mean "different words". A poem **fits** a pattern when letters and words pair up perfectly: the same letter always stands for the same word, and two different letters never stand for the same word.

You are given a `pattern` and a list of `words`. They may have different lengths. Return the length of the **longest prefix** (counting the first `L` letters against the first `L` words) that still fits. The empty prefix always fits.

## Examples

- `pattern = "abba"`, `words = ["sun","moon","moon","sun"]` gives `4`.
- `pattern = "abba"`, `words = ["sun","moon","moon","star"]` gives `3` (`a` would have to be both `sun` and `star`).
- `pattern = "abc"`, `words = ["x","x"]` gives `1` (`a` and `b` would both be `x`, and only two words exist).
- `pattern = ""`, `words = ["a"]` gives `0`.

## Constraints

- `0 <= pattern.length() <= 100000`, `0 <= words.size() <= 100000`
- Each word has `1` to `10` lowercase letters; the pattern has only lowercase letters.
- The total number of word characters is at most `1000000`.
