# Run Squash

A conveyor belt carries labelled crates. Whenever several crates in a row carry the same label, the inspector keeps only the first crate of that run. Crates with equal labels that are separated by a different label are both kept.

Given the labels `nums` in belt order, return the labels that remain, in the same order.

## Examples

- `nums = [4, 4, 7, 7, 7, 4]` gives `[4, 7, 4]`.
- `nums = [1, 2, 3]` gives `[1, 2, 3]`.
- `nums = [9, 9, 9, 9]` gives `[9]`.
- `nums = []` gives `[]`.

## Constraints

- `0 <= nums.size() <= 300000`
- `-1000000000 <= nums[i] <= 1000000000`
- `nums` is **not** sorted
