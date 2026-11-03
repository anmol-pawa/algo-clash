## Nudge
Say the input has 2 rows and 3 columns. How many rows and how many columns must the answer have?
## Approach
Create the answer first with the swapped shape, `cols` rows of `rows` zeros each, then copy every cell: the value at `grid[i][j]` goes to `turned[j][i]`.
## Key insight
`vector<vector<int>> turned(cols, vector<int>(rows));` builds the 2D vector in one line. Do not reuse one square loop bound for both dimensions: rows and columns are different sizes unless the grid happens to be square.
