# Calm Window

A sensor logs one lowercase letter per tick as a string `s`. A stretch of consecutive ticks is **calm** if it contains at most `k` different letters.

Return the length of the longest calm stretch in `s`.

## Examples

- `s = "eceba"`, `k = 2` gives `3` (the stretch `"ece"`).
- `s = "aaaa"`, `k = 1` gives `4`.
- `s = "abc"`, `k = 5` gives `3`.

## Constraints

- `0 <= s.length() <= 100000`
- `s` contains only `a` to `z`.
- `1 <= k <= 26`
