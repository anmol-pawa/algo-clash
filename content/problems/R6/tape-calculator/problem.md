# Tape Calculator

An old shop calculator reads a **tape** of tokens left to right. A token is either an integer (such as `"12"` or `"-3"`) or one of the operators `"+"`, `"-"`, `"*"`, `"/"`. An operator takes the **two most recent unused values**, with the older one on the left, and replaces them with the result.

Division truncates toward zero (`7 / -2` is `-3`, and `-7 / 2` is `-3`). Return the final value left on the tape.

## Examples

- `tape = ["2", "3", "+", "4", "*"]` gives `20` (that is `(2 + 3) * 4`).
- `tape = ["10", "2", "-"]` gives `8` (older value on the left: `10 - 2`).
- `tape = ["-7", "2", "/"]` gives `-3`.

## Constraints

- `1 <= tape.length <= 100001`, and the tape is always valid: it leaves exactly one value.
- Every operand is an integer in `[-1000000, 1000000]`.
- Every division has a non-zero divisor, and every intermediate result fits in a 32-bit signed integer.
