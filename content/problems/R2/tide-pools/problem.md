# Tide Pools

A sea wall is built from unit-wide columns, and `heights[i]` is the height of column `i`. When the tide recedes, water stays in the hollows. A unit cell above a column holds water if there is a taller-or-equal wall somewhere to its left **and** somewhere to its right; the water level there is the lower of the two tallest walls on each side.

Return the total number of unit cells of water left behind. The ends of the wall are open, so water never rests beyond them.

## Examples

- `heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]` gives `6`.
- `heights = [4, 2, 0, 3, 2, 5]` gives `9`.
- `heights = [3, 0, 2]` gives `2`.

## Constraints

- `0 <= heights.size() <= 100000`
- `0 <= heights[i] <= 100000`

The answer can exceed 32 bits. Aim for O(n) time and O(1) extra space.
