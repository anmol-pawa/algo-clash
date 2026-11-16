# Ledger Fold

A harbour clerk writes each day's accounts as one line of arithmetic, the way the old tide-masters did. The line holds non-negative whole numbers, the four operators `+`, `-`, `*` and `/`, round brackets, and spaces. Fold the line into a single number.

The rules of the ledger:

- `*` and `/` bind tighter than `+` and `-`. Operators of the same strength are applied **left to right**.
- Brackets are resolved first, innermost out.
- A `-` is also allowed as a **sign** in front of a number or a bracket: at the very start, right after `(`, or right after another operator. It negates what follows it.
- `/` is whole-number division that **truncates toward zero**, so `7 / 2` is `3` and `-7 / 2` is `-3`.

Return the value of the line.

## Examples

- `ledger = "2 + 3 * 4"` gives `14`.
- `ledger = "(2 + 3) * 4"` gives `20`.
- `ledger = "8 - 3 - 2"` gives `3`, not `7`.
- `ledger = "2 * -(3 + 4)"` gives `-14`.
- `ledger = "-7 / 2"` gives `-3`.
- `ledger = "10 - (4 - (1 - 2))"` gives `5`.

## Constraints

- `1 <= ledger.size() <= 200000`
- The line is always a valid expression made only of digits, `+ - * /`, `(`, `)` and spaces. Spaces may appear anywhere between tokens but never inside a number.
- Every number is between `0` and `2147483647`.
- No division by zero ever happens, and **every value computed along the way** (each number, each intermediate result, the final answer) fits in a signed 32-bit integer.
- Brackets may be nested very deeply.
