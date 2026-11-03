# Ledger Digits

The harbour clerk checks each ledger number by adding up its decimal digits. The sign is not a digit, so `-407` and `407` both give `4 + 0 + 7 = 11`.

Given the ledger number `n`, return the sum of its decimal digits.

## Examples

- `n = 1234` gives `10`.
- `n = -407` gives `11`.
- `n = 0` gives `0`.

## Constraints

- `-9223372036854775807 <= n <= 9223372036854775807` (it fits in a 64-bit signed integer).
