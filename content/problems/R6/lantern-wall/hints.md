## Nudge
Fix the bottom row of a candidate rectangle. For each column, how many lit panes sit in an unbroken stack directly above (and including) that row? Once you have those numbers for one row, what classic problem do they form?

## Approach
Keep an array `height[c]` for the columns. Moving down a row, a lit pane makes `height[c]` one taller; a dark pane resets it to 0. After updating a row, the best rectangle whose bottom edge lies on that row is the largest rectangle in the histogram `height`.

## Key insight
You already know the linear-time histogram answer with a monotonic stack (one pass, with a zero sentinel that flushes the stack). Run it once per row. Total work is rows times columns, and only one `height` array is kept.
