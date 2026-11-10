# Peak Stretch

A buoy records one integer reading per minute, in the list `readings`. Readings can be negative. Look at every block of exactly `k` consecutive minutes and add up its readings.

Return the largest block total.

## Examples

- `readings = [1, 4, 2, 10, 3]`, `k = 2` gives `13` (the block `[10, 3]`; the block `[2, 10]` only gives 12).
- `readings = [-5, -2, -9]`, `k = 1` gives `-2`.
- `readings = [3, -1, 3]`, `k = 3` gives `5`.

## Constraints

- `1 <= k <= readings.size() <= 100000`
- `-1000 <= readings[i] <= 1000`
