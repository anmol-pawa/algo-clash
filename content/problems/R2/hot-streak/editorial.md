## Signals
"Best contiguous stretch" with negative numbers allowed and at least one element required. A running best-ending-here quantity is the signature of Kadane's algorithm, a one-dimensional DP in disguise.

## Brute force
Try every pair of endpoints, accumulating the sum as the right end grows: O(n^2) time, O(1) space. About 5 * 10^9 additions at n = 100000, which times out.

## Key insight
Let `E[i]` be the best total of a stretch ending at day `i`. A stretch ending at `i` is either day `i` alone or a stretch ending at `i - 1` plus day `i`, so `E[i] = max(g[i], E[i-1] + g[i])`. The answer is `max E[i]`. If `E[i-1]` is negative, carrying it only hurts, so it is dropped.

## Optimal
One pass keeping two numbers, `endingHere` and `best`. Time O(n), space O(1). The recurrence only looks one step back, so the DP array collapses into a single variable.

## C++ walkthrough
Totals reach 10^5 x 10^9 = 10^14, so use `long long` for both variables. `max(gains[i], endingHere + gains[i])` mixes `int` and `long long`, which does not deduce for `std::max`: write `max<long long>(...)` or cast. Seed with `gains[0]` and loop from 1.

## Common bugs
Seeding `best` with 0 (returns 0 instead of a negative answer for all-loss input); `int` accumulators; resetting at `sum < 0` before recording `best`; looping from 0 after seeding with `gains[0]` (double counts day 0, which is harmless for the answer but shows the invariant is unclear).

## Follow-ups
Return the start and end indices. Maximum product subarray (track both max and min). Maximum sum when the array is circular (see Ring Gain). Largest sum with at most one deleted element.

## Similar problems
Maximum Subarray (LeetCode 53).
