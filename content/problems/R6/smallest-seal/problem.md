# Smallest Seal

A vault seal is a number written as a string of digits. The vault clerk must scratch out exactly `k` digits of the `code`. The remaining digits keep their order and form a new number. The clerk wants the **smallest possible number**.

Return that number as a string. Write it with no leading zeros; if nothing is left, or only zeros are left, return `"0"`.

## Examples

- `code = "4132", k = 1` gives `"132"`: scratching the 4 beats every other choice.
- `code = "10200", k = 1` gives `"200"`: scratch the 1, and the leading zero disappears.
- `code = "9", k = 1` gives `"0"`.
- `code = "12345", k = 2` gives `"123"`: the digits only grow, so the last ones go.

## Constraints

- `0 <= code.length() <= 100000`, and `code` contains only digits (it may start with `0`).
- `0 <= k <= code.length()`
- For an empty `code` the answer is `"0"`.
