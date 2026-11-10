# Tight Patch

A solar array has panels in a row, and `power[i]` is the output of panel `i` (always positive). You want to wire up a **patch**: a run of consecutive panels whose total output is at least `need`.

Return the number of panels in the shortest patch that works, or `0` if even the whole row falls short.

## Examples

- `power = [2, 3, 1, 2, 4, 3]`, `need = 7` gives `2` (the patch `[4, 3]`).
- `power = [1, 1, 1]`, `need = 10` gives `0`.
- `power = [8]`, `need = 8` gives `1`.

## Constraints

- `0 <= power.size() <= 100000`
- `1 <= power[i] <= 1000`
- `1 <= need <= 1000000000`
