## Nudge
Write down where the cell at row `i`, column `j` of a 2 x 3 grid lands in the turned 3 x 2 grid. How many rows does the answer have?
## Approach
Allocate the answer first with the swapped shape, `C` rows of `R` zeros, then copy every cell once to its new home.
## Key insight
Cell `(i, j)` moves to `(j, R - 1 - i)`. Check it on the example: the `4` at `(1, 0)` goes to `(0, 0)`, the `1` at `(0, 0)` goes to `(0, 1)`. Size the answer as `vector<vector<int>> out(C, vector<int>(R))`, not `(R, ...)`.
