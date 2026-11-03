# Safe Midpoint

A surveyor marks two posts on a very long road, at positions `lo` and `hi` metres from the start, with `lo <= hi`. Place a third post halfway between them. When the gap is odd, round down to the nearer post at the `lo` side.

Return the position of the middle post.

## Examples

- `lo = 2, hi = 8` gives `5`.
- `lo = 3, hi = 6` gives `4`.
- `lo = 2147483646, hi = 2147483647` gives `2147483646`.

## Constraints

- `0 <= lo <= hi <= 2147483647`
