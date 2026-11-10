# Matching Pairs

A merchant stamps each coin with an integer value and keeps them in a row, `nums`. Two coins **match** when their values add up to `target`.

Count the pairs of positions `i < j` with `nums[i] + nums[j] == target`. Two coins with equal values still count as two different coins.

## Examples

- `nums = [1, 4, 2, 3]`, `target = 5` gives `2` (positions `0,1` and `2,3`).
- `nums = [2, 2, 2]`, `target = 4` gives `3`.
- `nums = [7]`, `target = 7` gives `0`.

## Constraints

- `0 <= nums.size() <= 100000`
- `-1000000 <= nums[i] <= 1000000`
- `-2000000 <= target <= 2000000`
