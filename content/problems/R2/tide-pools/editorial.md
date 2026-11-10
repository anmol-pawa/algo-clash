## Signals
"Water held between walls": each position's answer depends on the best wall on each side, and a global sum over positions is requested. Prefix and suffix maxima appear naturally; the O(1)-space ask points to two pointers.

## Brute force
For every column, scan left for the tallest wall and right for the tallest wall, and add `min(leftMax, rightMax) - height`. O(n^2) time, O(1) space; at n = 100000 that is about 10^10 operations.

A better version precomputes `leftMax[i]` and `rightMax[i]` in two passes, then sums `min(leftMax[i], rightMax[i]) - heights[i]`. O(n) time, O(n) space.

## Key insight
We only need `min(leftMax, rightMax)` at each column. Keep pointers at both ends and the tallest wall seen so far from each end. If `heights[left] < heights[right]`, then the right side holds a wall at least `heights[right] > heights[left]`, so the bound at `left` is exactly the running maximum on its own side, regardless of what lies between. Process `left` and move on. The symmetric case handles `right`.

## Optimal
Maintain `leftWall`, `rightWall` and `water` (a `long long`). While `left < right`: process the end with the smaller height: update that side's wall with `max`, add `wall - height`, and move that pointer inward. Invariant: all columns outside `[left, right]` have their water counted exactly. Each iteration finalises one column, so time is O(n), space O(1).

## C++ walkthrough
The total can reach about 10^5 x 10^5 = 10^10, so `water` must be `long long`; each added term fits in `int`. When `heights[left] == heights[right]` either side may move; the `else` branch handles it. Taking `heights` by value is not needed (a `const vector<int>&` is better), it is by value here only to match the judge's signature.

## Common bugs
Using the global maximum instead of per-side maxima; accumulating in `int`; counting water over the very first or last column's outside; stopping at the global peak and ignoring basins after it; updating the wall after adding water (so negative contributions appear).

## Follow-ups
Do it with a monotonic stack. Trap water on a 2-D grid (use a heap with Dijkstra-like expansion). What if heights stream in?

## Similar problems
Trapping Rain Water (LeetCode 42); Container With Most Water is the easier cousin (see Widest Basin).
