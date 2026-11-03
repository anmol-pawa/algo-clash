# Charge Meter

A battery charges from a stream of readings, one per tick. A **negative** reading is sensor noise and is ignored. Every other reading is added to the stored charge, which starts at `0`.

Return the index of the first tick after which the stored charge is **at least** `limit`. If the charge never reaches `limit`, return `-1`.

## Examples

- `readings = [4, -3, 5, 2], limit = 9` gives `2`. The `-3` is skipped, the charge is 4 then 9.
- `readings = [1, 1], limit = 5` gives `-1`.
- `readings = [7], limit = 7` gives `0`.

## Constraints

- `0 <= readings.size() <= 100000`
- `-1000000000 <= readings[i] <= 1000000000`
- `1 <= limit <= 100000000000000`
