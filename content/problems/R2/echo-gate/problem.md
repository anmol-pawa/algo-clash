# Echo Gate

A gate records the id of every visitor in order, as `pings`. The gate raises an alarm if the **same id appears twice within `k` steps**: two positions `i < j` with `pings[i] == pings[j]` and `j - i <= k`.

Return `true` if the alarm would ring, otherwise `false`.

## Examples

- `pings = [4, 9, 4]`, `k = 2` gives `true`.
- `pings = [4, 9, 4]`, `k = 1` gives `false`.
- `pings = [1, 2, 3]`, `k = 5` gives `false`.

## Constraints

- `0 <= pings.size() <= 100000`
- `-1000000000 <= pings[i] <= 1000000000`
- `1 <= k <= 100000`
