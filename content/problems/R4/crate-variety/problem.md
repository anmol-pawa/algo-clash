# Crate Variety

A conveyor carries crates in a row. `kinds[i]` is the kind code of the `i`-th crate. You may grab one **contiguous** stretch of crates, but your bag can hold at most `k` different kinds.

Return the length of the longest stretch you can grab.

## Examples

- `kinds = [1,2,1,3,3,2]`, `k = 2` gives `3` (the stretch `[1,2,1]`, or `[3,3,2]`).
- `kinds = [7,7,7]`, `k = 1` gives `3`.
- `kinds = [4,5]`, `k = 0` gives `0`.

## Constraints

- `0 <= kinds.size() <= 100000`
- `-1000000000 <= kinds[i] <= 1000000000`
- `0 <= k <= 100000`
