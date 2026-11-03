# Overlap Count

A sailor's tune is written as a string of letters. A phrase is a shorter string. Count how many positions in the tune are the start of the phrase. Occurrences may overlap: the phrase `aa` appears three times in `aaaa`.

## Examples

- `text = "aaaa", pat = "aa"` gives `3`.
- `text = "abcabc", pat = "bc"` gives `2`.
- `text = "abc", pat = "d"` gives `0`.
- `text = "ab", pat = "abc"` gives `0` (the phrase is longer than the tune).

## Constraints

- `0 <= text.size() <= 200000`
- `1 <= pat.size() <= 50`
- both strings contain lowercase letters only
