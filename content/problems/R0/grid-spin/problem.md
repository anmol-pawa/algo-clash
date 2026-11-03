# Grid Spin

A tile floor is stored as a grid of numbers with `R` rows and `C` columns (it need not be square). The workers turn the whole floor a quarter-turn clockwise, so the old left column becomes the new top row, read from bottom to top.

Return the turned grid. It has `C` rows and `R` columns.

## Examples

- `grid = [[1,2,3],[4,5,6]]` gives `[[4,1],[5,2],[6,3]]`.
- `grid = [[7]]` gives `[[7]]`.
- `grid = [[1],[2],[3]]` gives `[[3,2,1]]`.
- `grid = []` gives `[]`.

## Constraints

- `0 <= R`, and if `R > 0` then `1 <= C`; `R * C <= 250000`
- `-1000000000 <= grid[i][j] <= 1000000000`
- All rows have the same length.
