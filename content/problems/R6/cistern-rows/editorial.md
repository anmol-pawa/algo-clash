## Signals
A row of bar heights and a question about water held between them. This is the same question as Tide Pools in the Two Pointers region, and it has a second solution: the monotonic-stack one. The stack signal here is "a taller wall arriving closes every lower basin to its left", which is the "next greater element" shape you met in Heat Wave.

## Brute force
For every pillar, scan left for the tallest wall and right for the tallest wall. The water above that pillar is `min(leftBest, rightBest) - height`. Correct and easy to trust, but O(n^2): about 4 * 10^10 steps for n = 200000.

## Key insight
Two routes make it linear. Prefix and suffix maxima, or two pointers, compute the water **column by column**. The stack computes it **layer by layer**: when a pillar `i` is taller than the stack top, the top is the floor of a basin whose right wall is `i` and whose left wall is the next pillar down the stack. The water in that basin between the floor's height and `min(left, right)` is now fixed forever, so add it and pop. A new wall can close several nested basins in a row, each one a thicker layer, which is why the pops sit in a `while`.

## Optimal
Keep a stack of indices with non-increasing heights. For each `i`, while the top is strictly lower than `ridge[i]`: pop it as the floor; if the stack is now empty there is no left wall, so that water spills (stop popping); otherwise add `(i - left - 1) * (min(ridge[left], ridge[i]) - ridge[floor])`. Then push `i`. Every index is pushed once and popped once, so the time is O(n) and the stack is O(n) space. The two-pointer solution does the same in O(1) space, so mention the trade-off in the interview: the stack costs memory but generalises (it also answers "how deep is the water at each position at the moment wall i appears?").

## C++ walkthrough
Make `width` and `depth` `long long` before multiplying. A single basin can be 200000 wide and 100000 deep, 2 * 10^10 cells, past `int`. Use `<` rather than `<=` for the pop test: an equal wall leaves a zero-depth layer and the next taller wall measures the wider basin through it, so equal heights simply stack. Do not forget the `break` when the stack empties after the pop, or you read `stack.back()` on an empty vector.

## Common bugs
Forgetting to subtract the floor height (counting stone as water); `int` overflow of the total or of the width times depth product; measuring width from the popped floor instead of from the new top; counting water against only the left maximum, so a descending staircase "holds" water that runs off the right end; and reading `stack.back()` after the stack emptied.

## Follow-ups
Return the water level over every pillar, not just the total; the 2D version (water on a grid of heights) which needs a min-heap flooding from the border; the same row with pumps that remove water at one position; streaming updates to one pillar.

## Similar problems
Trapping Rain Water (LeetCode 42) is this exactly. Tide Pools, in the Two Pointers region, is the O(1)-space solution of the same question. Largest Rectangle in Histogram (LeetCode 84), the region's Skyline Hall, uses the same pop-and-measure loop with the opposite monotonic order. Container With Most Water (LeetCode 11) is a different question that looks similar.
