# Tidy Tape

A label printer prints one lowercase letter per tick onto a long tape, given as the string `tape`. A stretch of consecutive letters is **tidy** if no letter appears more than `m` times inside it.

Return the length of the longest tidy stretch. (With `m = 1` this asks for the longest stretch of all-different letters.)

## Examples

- `tape = "abcabcbb"`, `m = 1` gives `3` (`"abc"`).
- `tape = "aabaabaa"`, `m = 2` gives `4` (`"baab"`; every stretch of 5 holds at least three `a`).
- `tape = "zzzz"`, `m = 10` gives `4`.

## Constraints

- `0 <= tape.length() <= 100000`
- `tape` contains only `a` to `z`.
- `1 <= m <= 100000`
