## Signals
A circular array and "best contiguous stretch". The new twist over Hot Streak is that the stretch may wrap, so the stretch is either an ordinary interval or the complement of an ordinary interval.

## Brute force
Start at each stall and extend around the ring up to `n` stalls, tracking the best total: O(n^2) time, O(1) space, about 5 * 10^9 steps at the limit, which times out.

## Key insight
Case 1: the chosen run does not wrap; this is ordinary Kadane. Case 2: it wraps, so the stalls left out form one contiguous block strictly inside the array; the run's total is `total - (that block)`, which is largest when the block's sum is smallest. So case 2 is `total - (minimum subarray sum)`, computed by Kadane with min instead of max. Edge: if the minimum block is the entire array (every value negative) case 2 would choose an empty run, so the answer falls back to case 1.

## Optimal
One pass maintaining `total`, the max Kadane pair and the min Kadane pair. Time O(n), space O(1). The case split gives `max(maxBest, total - minBest)`, guarded by `maxBest < 0`: if the best plain stretch is negative, all values are negative and the least bad single stall is the answer.

## C++ walkthrough
All accumulators are `long long` (totals reach 10^14). `max(g, maxEnd + g)` needs both arguments of the same type, hence `const long long g`. Initialise from `gains[0]` and loop from index 1 so single-element input works. The guard `maxBest < 0` is equivalent to "all values negative" and avoids a separate scan.

## Common bugs
Ignoring the wrap case; the all-negative empty-run trap; `int` accumulators; computing the minimum with the maximum's code and a sign slip; trying to double the array and running a window (works but needs care to cap the length at `n`).

## Follow-ups
Return the start and length of the best run. Solve it with prefix sums and a monotonic deque over the doubled array (length at most `n`). What if the run must contain at least two stalls?

## Similar problems
Maximum Sum Circular Subarray (LeetCode 918).
