# Triple Tally

A salvage crew logs the buoyancy of each crate as an integer: positive crates float, negative crates sink. A **balanced trio** is three crates whose buoyancy sums to exactly `0`.

Given the list `nums`, return how many **distinct** balanced trios exist. Two trios are the same if they hold the same three values, regardless of which crates they came from or in what order. For example, `[-1, 0, 1]` taken from two different `-1` crates is still one trio.

## Examples

- `nums = [-1, 0, 1, 2, -1, -4]` gives `2` (the trios `-1, -1, 2` and `-1, 0, 1`).
- `nums = [0, 1, 1]` gives `0`.
- `nums = [0, 0, 0, 0]` gives `1`.

## Constraints

- `0 <= nums.size() <= 3000`
- `-100000 <= nums[i] <= 100000`

A cubic scan over all trios is too slow; aim for O(n^2).
