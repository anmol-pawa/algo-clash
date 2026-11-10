# Scramble Clans

A word-smith sorts a list of words into **clans**: two words belong to the same clan when one is a rearrangement of the other (every letter used exactly once). Equal words belong to the same clan.

Return the size of the largest clan in `words`, or `0` if the list is empty.

## Examples

- `words = ["tea", "eat", "tan", "ate", "nat", "bat"]` gives `3` (the clan `tea, eat, ate`).
- `words = ["abc", "abd", "abe"]` gives `1`.
- `words = ["aa", "aa", "aa"]` gives `3`.

## Constraints

- `0 <= words.size() <= 20000`
- `1 <= words[i].length() <= 20`
- Every word contains only `a` to `z`.
