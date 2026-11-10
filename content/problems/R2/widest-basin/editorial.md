## Signals
"Best pair of positions" where the value is (distance) x (the smaller of two things). The value has a trade-off between width and height, and the input is not sorted, so look for a greedy argument that discards candidates.

## Brute force
Try all pairs `(i, j)` and take the maximum of `(j - i) * min(heights[i], heights[j])`. O(n^2) time, O(1) space: about 5 billion pairs at n = 100000, which times out.

## Key insight
Start with the widest pair `(0, n - 1)`. Suppose `heights[left] <= heights[right]`. Any pair using `left` with a partner closer than `right` has smaller width and height at most `heights[left]`, so it cannot beat the current capacity. Hence `left` can be dropped without losing the optimum.

## Optimal
Two pointers at the ends. Each step: update `best` with `(right - left) * min(h[left], h[right])`, then move the pointer at the shorter post inward (either one on a tie). Invariant: the optimal pair lies within `[left, right]` or its value has already been recorded. Each step shrinks the window by one, so time is O(n), space O(1).

## C++ walkthrough
`(right - left) * min(...)` can reach 10^5 x 10^5 = 10^10, which overflows `int`; widen one operand to `long long` before multiplying (`static_cast<long long>(right - left) * ...`), not the product afterwards. `std::min` on two `int`s returns an `int`.

## Common bugs
Moving the taller pointer; using `right - left + 1` as the width; computing the product in `int`; returning garbage for `n < 2` (the loop condition handles it); trying to prove correctness with the sorted case only.

## Follow-ups
Return the pair of indices. What if the tarp must stay above every post in between (that is Tide Pools)? What if heights are streamed?

## Similar problems
Container With Most Water (LeetCode 11).
