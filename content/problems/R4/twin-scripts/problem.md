# Twin Scripts

Two scripts are **twins** if you can rename the symbols of one to get the other. A renaming must be a perfect pairing: the same symbol always becomes the same new symbol, and two different symbols never become the same new symbol. A symbol may be renamed to itself.

Given strings `a` and `b` of equal length, return `true` if they are twins.

## Examples

- `a = "paper"`, `b = "title"` gives `true` (`p→t`, `a→i`, `e→l`, `r→e`).
- `a = "foo"`, `b = "bar"` gives `false` (`o` would have to become both `a` and `r`).
- `a = "ab"`, `b = "cc"` gives `false` (`a` and `b` would both become `c`).

## Constraints

- `0 <= a.length() == b.length() <= 100000`
- Both strings contain only lowercase letters and digits.
