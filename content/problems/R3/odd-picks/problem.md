# Odd Picks

A game master lays out a row of number cards, `nums`. A stretch of consecutive cards is a **lucky pick** when it contains **exactly `k` odd numbers** (any number of even ones).

Count the lucky picks. Two stretches are different when they start or end at different positions, even if they hold the same values.

## Examples

- `nums = [1, 1, 2, 1, 1]`, `k = 3` gives `2` (positions 0..3 and 1..4).
- `nums = [2, 4, 6]`, `k = 1` gives `0`.
- `nums = [2, 1, 2]`, `k = 1` gives `4` (`[1]`, `[2,1]`, `[1,2]`, `[2,1,2]`).

## Constraints

- `0 <= nums.size() <= 100000`
- `1 <= nums[i] <= 1000000000`
- `1 <= k <= 100000`
- The answer can exceed the range of a 32-bit integer.
