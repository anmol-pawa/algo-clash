## Signals
"Row becomes column", a non-square matrix, and an output whose shape differs from the input's.

## Brute force
Walk down each input column and push its values into a new row. This is already O(rows * cols), the best possible because every value must be written once. It is the checker, and it shows the idea without any index arithmetic about the answer's shape.

## Key insight
The output shape is `cols x rows`. Allocate it up front with `vector<vector<int>> turned(cols, vector<int>(rows))`, then assign `turned[j][i] = grid[i][j]`. All bugs in this problem come from mixing up which size belongs to which dimension.

## Optimal
One pass over all cells. Time O(rows * cols), space O(rows * cols) for the answer (the input is read-only, so an in-place swap is only possible for square grids).

## C++ walkthrough
`vector<int>(rows)` is a row of `rows` zeros; the outer constructor copies that row `cols` times. `grid[0].size()` is the column count, which is why the constraints promise at least one row. `size_t` is unsigned, so the loops use `<` and never count down past zero. `const vector<vector<int>>&` avoids copying the whole grid.

## Common bugs
Assuming a square grid and swapping in place; allocating `rows x cols` instead of `cols x rows`; reading `grid[0].size()` on an empty grid (excluded here); using `int` loop variables compared against `size_t`, which draws warnings.

## Follow-ups
Rotate the grid 90 degrees clockwise (transpose, then reverse each row). Transpose a square grid in place. Flatten the grid into one vector and index it as `i * cols + j`.

## Similar problems
Transpose Matrix (LeetCode 867).
