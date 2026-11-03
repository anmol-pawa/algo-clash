# Letter Tally

A printer is counting how many times each letter of the alphabet appears in a message. Uppercase and lowercase count as the same letter, and anything that is not a letter (digits, spaces, punctuation) is ignored.

Return a vector of exactly 26 integers: entry `0` is the count of `a`/`A`, entry `1` the count of `b`/`B`, and so on up to entry `25` for `z`/`Z`.

## Examples

- `s = "Abba"` gives `2` at index 0, `2` at index 1 and zeros elsewhere.
- `s = "zZ!"` gives `2` at index 25 and zeros elsewhere.
- `s = "42 [@]"` gives 26 zeros.

## Constraints

- `0 <= s.size() <= 200000`
- `s` contains printable ASCII characters (codes 32 to 126)
