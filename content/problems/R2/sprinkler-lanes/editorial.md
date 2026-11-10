## Signals
Lots of "add a value to every cell in a range" updates, and the question is only about the array after all of them. When queries and updates are not interleaved, the difference array is the tool.

## Brute force
For each job, loop from `l` to `r` and add `v`. O(lanes * jobs) = 10^10 in the worst case, which times out.

## Key insight
Store differences instead of values: `delta[i] = level[i] - level[i-1]`. A range add changes only two differences: `+v` at `l` (the level jumps up) and `-v` at `r + 1` (it jumps back). Recovering levels is a prefix sum over `delta`, which is the inverse of taking differences.

## Optimal
One pass over jobs updating two cells each, then one prefix-sum pass. Time O(lanes + jobs), space O(lanes). The array has `lanes + 1` slots so that `r + 1` for the last lane is safe; the extra slot is never read as a level.

## C++ walkthrough
Contributions stack: 10^5 jobs of 10^9 can put 10^14 in a single lane, so `delta`, the running total and the result must be `long long`. `vector<long long>(lanes + 1, 0)` value-initialises; forgetting the `+ 1` writes one past the end. Pass `jobs` by `const auto&` in the loop.

## Common bugs
Cancelling at `r` instead of `r + 1`; forgetting to cancel at all; an off-by-one array size; `int` accumulation; trying to maintain levels directly and re-introducing the inner loop.

## Follow-ups
What if queries for single-lane levels arrive between jobs? (Fenwick tree with range update, point query.) Extend to a 2-D grid with rectangle updates. What if only the maximum final level is needed? (Sort the event points.)

## Similar problems
Corporate Flight Bookings (LeetCode 1109), Range Addition (LeetCode 370).
