## Signals
A binary grid and a request for the biggest all-ones rectangle. Rectangles in a grid are too many to list, but a rectangle always has a bottom edge, and everything above that edge is just "how tall is the lit stack in each column". That turns a 2D question into a sequence of 1D histogram questions, and a histogram with "widest span where this bar is the minimum" is the monotonic-stack signal.

## Brute force
For each pane as a top-left corner, walk down the rows while narrowing the available width to the shortest lit run seen so far, and track the best area. With precomputed run lengths this is O(rows^2 * cols), about 6 * 10^7 steps on a 500 x 500 grid, which is fine there but grows quickly toward 1000 rows. The naive version that enumerates all four corners and checks the rectangle with prefix sums is O(rows^2 * cols^2): 6 * 10^10 on the same grid.

## Key insight
Process rows top to bottom and maintain `height[c]`: the number of consecutive lit panes ending at the current row in column `c` (0 if the current pane is dark). Any all-lit rectangle has a bottom row, and in that row its width-`w` span of columns all have `height >= h`, where `h` is its height. So the best rectangle with its bottom on this row is exactly the largest rectangle in the histogram `height`. Take the best over all rows.

## Optimal
For every row, update `height` in O(cols), then solve the histogram with the monotonic stack: keep indices of non-decreasing heights; when a shorter bar (or a sentinel of height 0 after the last column) arrives, pop each taller bar, whose rectangle spans from the new stack top plus one to the current index minus one. Each column is pushed and popped once per row, so the total is O(rows * cols) time and O(cols) extra space. Keeping the grid transposed so that `cols` is the smaller side does not change the bound, but the stack never needs more than the number of columns.

## C++ walkthrough
Use `vector<int> height(cols + 1)` with the extra slot permanently 0 as the sentinel, so the stack flushes at the end of every row without a special case. Reset the stack for each row. Areas are at most 250000 so `int` is safe, but write `width = stack.empty() ? i : i - stack.back() - 1` carefully: the index after popping is the previous kept bar, not `i - 1`.

## Common bugs
Not resetting `height[c]` to 0 on a dark pane (heights carry over a hole); running the stack without the flush so rectangles touching the right edge are lost; solving "largest square" instead (the Maximal Square DP is a different problem and gives a smaller answer on wide rectangles); only measuring the longest horizontal or vertical run; and `char` arithmetic slips such as adding `wall[r][c]` directly instead of comparing with `'1'`.

## Follow-ups
Return the rectangle's coordinates, not just its area; handle updates that flip one pane and re-query; count all-lit rectangles instead of finding the largest (a different stack-based counting recurrence); extend to the largest rectangle of cells with value at least k in a matrix of integers.

## Similar problems
Maximal Rectangle (LeetCode 85) is this exactly. Largest Rectangle in Histogram (LeetCode 84) is the subroutine and is the region's Skyline Hall. Maximal Square (LeetCode 221) is the DP cousin with a square instead of a rectangle.
