## Signals
A rectangular grid, "turn it", and an answer whose shape differs from the input. When the output shape is not the input shape, allocate the output first and think in terms of where each input cell lands.

## Brute force
Transpose the grid (cell `(i, j)` goes to `(j, i)`), then reverse every row. Two passes and an easy argument: a transpose followed by a mirror is a clockwise quarter-turn. It is O(R * C) as well, so it is only "brute" in being a recipe instead of a formula, but it makes an independent checker for the direct formula.

## Key insight
The top row, read left to right, becomes the right column read top to bottom. In general the cell at `(i, j)` lands at `(j, R - 1 - i)`. Because `R != C` in general, the answer must be created with `C` rows of length `R`; allocating `R` rows of length `C` writes outside the vectors.

## Optimal
One allocation and one double loop. Time O(R * C), space O(R * C) for the answer, which is unavoidable because the answer is a new grid.

## C++ walkthrough
`vector<vector<int>> out(cols, vector<int>(rows))` builds `cols` independent rows of `rows` zeros. Take the input as `const vector<vector<int>>&`: it is only read, and copying a 2D vector copies every row. Compute `rows = grid.size()` and `cols = grid.empty() ? 0 : grid[0].size()` once; reading `grid[0]` on an empty grid is undefined behaviour, so guard it first. Use `size_t` for sizes and indices, or cast once, to avoid signed/unsigned warnings.

## Common bugs
Allocating `(R, C)` instead of `(C, R)`; returning the transpose without reversing; reading `grid[0].size()` when the grid is empty; mixing up which index is the row in the destination.

## Follow-ups
Rotate counter-clockwise. Rotate a square grid in place using four-way cell swaps and O(1) extra space. Rotate by `k` quarter-turns without doing `k` passes.

## Similar problems
Rotate Image (LeetCode 48), Transpose Matrix (LeetCode 867).
