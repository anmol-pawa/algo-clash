# Exact Stretches

You are given a list of integers `nums`, which may include negatives and zeros, and a number `target`. Count how many **consecutive, non-empty stretches** of the list add up to exactly `target`. Stretches at different positions count separately even if they hold the same values.

## Examples

- `nums = [1, 2, 3]`, `target = 3` gives `2` (`[1, 2]` and `[3]`).
- `nums = [1, -1, 1, -1]`, `target = 0` gives `4`.
- `nums = [0, 0, 0]`, `target = 0` gives `6`.

## Constraints

- `0 <= nums.size() <= 100000`
- `-1000 <= nums[i] <= 1000`
- `-1000000000 <= target <= 1000000000`

The count can exceed the range of a 32-bit integer (an array of zeros with target 0 has about 5 * 10^9 stretches). Aim for O(n) time.
