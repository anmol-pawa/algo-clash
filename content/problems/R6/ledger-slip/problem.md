# Ledger Slip

A shopkeeper writes each day's accounts as one line, the **slip**: non-negative whole numbers joined by `+` and `-`, with brackets and stray spaces. A `-` written right in front of a bracket **subtracts the whole group**.

Return the value of the slip. A `-` can also be a **negation**: it is one when it is the first thing on the slip or comes straight after a `(`, so `-4`, `(-4)` and `-(2+3)` are all fine. Every other `+` or `-` is an ordinary operator between two values. There is no multiplication or division.

## Examples

- `slip = "1 + 1"` gives `2`.
- `slip = " 12 - (3 + 4) "` gives `5`.
- `slip = "-(2 + (3 - 10)) + 1"` gives `6`.
- `slip = "(7)-(0)-(-5)"` gives `12`.

## Constraints

- `1 <= slip.size() <= 100000`
- The slip is always well formed: balanced brackets, and every number is an integer in `[0, 1000000000]` written without a sign.
- It contains only digits, `+`, `-`, `(`, `)` and spaces.
- The value fits in a 64-bit signed integer, and so does every partial sum.
