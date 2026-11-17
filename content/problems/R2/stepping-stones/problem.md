# Stepping Stones

A river has stones at the integer positions listed in `stones` (unsorted, and a position may be listed more than once). You can walk from a stone to the next one only if its position is exactly one higher.

Return the number of stones in the **longest path** you can walk, that is, the longest run of consecutive integers such as `5, 6, 7, 8` all present in the list. An empty list gives `0`.

## Examples

- `stones = [100, 4, 200, 1, 3, 2]` gives `4` (the path `1, 2, 3, 4`).
- `stones = [9, 1, 4, 7, 3, 2, 8, 0, 6, 5]` gives `10`.
- `stones = [5, 5, 5]` gives `1` (duplicates count once).

## Constraints

- `0 <= stones.size() <= 100000`
- `-1000000000 <= stones[i] <= 1000000000`
- Aim for linear time; sorting costs more than that.
