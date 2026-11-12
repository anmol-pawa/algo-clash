# Unroll Banner

Stackspire's banner-makers shorten long banners with a repeat code: `k[text]` stands for `text` written `k` times in a row. The text inside the brackets may itself contain repeat codes, nested to any depth. Letters outside any code are written once.

Given the shortened `banner`, return the full banner.

## Examples

- `banner = "2[ab]c"` gives `"ababc"`.
- `banner = "3[x2[y]]"` gives `"xyyxyyxyy"`: the inner code expands first.
- `banner = "ab12[z]"` gives `"abzzzzzzzzzzzz"`: counts can have several digits.
- `banner = "2[]x"` gives `"x"`: an empty text repeats into nothing.

## Constraints

- `0 <= banner.length() <= 100000`
- `banner` contains lowercase letters, digits, `[` and `]`. Every `[` has exactly one digit string directly before it (a count from `1` to `300`, no leading zeros) and exactly one matching `]`.
- Digits never appear except as a count in front of `[`.
- The full banner has at most `100000` characters.
