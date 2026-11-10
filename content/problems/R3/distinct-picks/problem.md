# Distinct Picks

A jeweller strings beads in a row; `beads[i]` is the colour code of bead `i`. A stretch of consecutive beads is **k-coloured** when it contains **exactly `k` different colour codes** (each may repeat any number of times).

Count the k-coloured stretches. Two stretches are different when they start or end at different positions, even if they hold the same colours.

## Examples

- `beads = [3, 1, 3, 2, 2]`, `k = 2` gives `5` (`[3,1]`, `[1,3]`, `[3,1,3]`, `[3,2]`, `[3,2,2]`).
- `beads = [4, 4, 4]`, `k = 1` gives `6` (every stretch).
- `beads = [1, 2, 3]`, `k = 4` gives `0`.

## Constraints

- `0 <= beads.size() <= 100000`
- `1 <= beads[i] <= 100000`
- `1 <= k <= 100000`
- The answer can exceed the range of a 32-bit integer.
