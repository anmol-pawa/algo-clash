## Nudge
A line that crosses fewer bricks must run along as many brick edges as possible. Which edge is shared by the most rows?

## Approach
For each row, walk its bricks and keep a running sum of widths. Each running sum (except the last, the right wall) is an edge position. Count how many rows have an edge at each position, using a hash map. The answer is the number of rows minus the largest count.

## Key insight
Rows are independent, so "number of rows with an edge at x" can be accumulated row by row. Use `long long` for positions: the total width can exceed 32 bits. Never count the final prefix, since the line may not run along the wall.
