# Tide Pair

A harbour logs one water-level reading per hour in the array `readings`. The harbour master wants two **different hours** `i < j` whose readings add up to `target`.

Several pairs may exist. Return `{i, j}` for the pair that finishes **earliest**: the smallest `j`, and among those the smallest `i`. If no pair exists, return `{-1, -1}`.

## Examples

- `readings = [2, 7, 11, 15]`, `target = 9` gives `[0, 1]`.
- `readings = [3, 3, 3]`, `target = 6` gives `[0, 1]` (the pair ending at hour 1 comes before the one ending at hour 2).
- `readings = [1, 4, 3, 6]`, `target = 7` gives `[1, 2]` (it ends at hour 2, earlier than `[0, 3]`).
- `readings = [5]`, `target = 10` gives `[-1, -1]` (one hour cannot pair with itself).

## Constraints

- `0 <= readings.size() <= 100000`
- `-1000000000 <= readings[i] <= 1000000000`
- `-1000000000 <= target <= 1000000000`
