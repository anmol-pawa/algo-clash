# Skyline Hall

A row of walls stands side by side, each exactly one unit wide. Wall `i` has height `heights[i]`. You want to build a rectangular hall out of consecutive walls: pick a stretch of `w` adjacent walls; the hall's height is limited by the shortest wall in that stretch, so its floor area is `w` times that shortest height.

Return the largest floor area you can get from any stretch of consecutive walls. If there are no walls, return `0`.

## Examples

- `heights = [2,1,5,6,2,3]` gives `10` (the walls of height 5 and 6 give `2 * 5`).
- `heights = [4,4,4]` gives `12`.
- `heights = [7]` gives `7`.

## Constraints

- `0 <= heights.length <= 100000`
- `0 <= heights[i] <= 10^9`
- The answer can exceed 32 bits.
