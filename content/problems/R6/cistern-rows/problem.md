# Cistern Rows

Under Stackspire runs a row of stone pillars, side by side, each one unit wide. `ridge[i]` is the height of pillar `i`. When the storm passes, rain pools in the dips between pillars.

A unit cell of water can sit at some height only if a pillar at least that tall stands somewhere to its left **and** somewhere to its right; otherwise it spills off the end. Water cannot soak into stone.

Return the total number of unit cells of water held by the whole row.

## Examples

- `ridge = [3, 0, 2, 0, 4]` gives `7`: 3 cells over the dip of 0, 1 over the dip of 2, and 3 over the second dip of 0.
- `ridge = [2, 0, 2]` gives `2`.
- `ridge = [1, 2, 3, 4]` gives `0`: it only climbs, so nothing holds water.
- `ridge = [5, 2, 1, 2, 5]` gives `10`.

## Constraints

- `0 <= ridge.size() <= 200000`
- `0 <= ridge[i] <= 100000`

The answer can exceed 32 bits.
