# Grid Turn

A map room stores each tide chart as a grid of integers, `rows` lines of `cols` numbers each. The archivist needs the chart turned on its side: the number at row `i`, column `j` of the input must appear at row `j`, column `i` of the output.

Return the turned grid. The result has `cols` rows and each of them has `rows` entries. The grid is not necessarily square.

## Examples

- `grid = [[1, 2, 3], [4, 5, 6]]` gives `[[1, 4], [2, 5], [3, 6]]`.
- `grid = [[7]]` gives `[[7]]`.
- `grid = [[1], [2], [3]]` gives `[[1, 2, 3]]`.

## Constraints

- `1 <= rows, cols` and `rows * cols <= 100000`
- every row has the same length
- `-1000000000 <= grid[i][j] <= 1000000000`
