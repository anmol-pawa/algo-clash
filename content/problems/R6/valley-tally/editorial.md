## Signals
"Sum (or count) a per-subarray quantity such as min or max over all subarrays." Flip the loop: for each element, count the subarrays where it is the extreme. The boundaries come from previous-smaller and next-smaller, which is a monotonic stack question.

## Brute force
Fix the left end, walk the right end and keep a running minimum, adding it to the total. That is O(n^2): for n = 100000 about 5 * 10^9 steps, too slow. Recomputing each minimum with a scan is O(n^3).

## Key insight
Every stretch has exactly one **owner**: its minimum, with ties broken toward one side. Let `left[i]` be the distance back to the previous depth that is strictly smaller than `depths[i]`, and `right[i]` the distance forward to the next depth that is smaller than or equal to it. The stretches owned by `i` start in any of the `left[i]` positions to the left (including `i`) and end in any of the `right[i]` positions to the right (including `i`), so there are `left[i] * right[i]` of them. The answer is the sum of `depths[i] * left[i] * right[i]`.

The asymmetric comparison (strict on one side, non-strict on the other) is what makes the ownership unique. With `[2, 2]`, step 0 owns `[2]` and nothing else to its right, while step 1 owns `[2]` and `[2, 2]`.

## Optimal
Use one stack of indices with strictly increasing depths. Scan `i` from 0 to n, treating the position `n` as a sentinel smaller than everything. While the stack top has depth `>= depths[i]`, pop it as `mid`: its next smaller-or-equal is `i`, and its previous strictly smaller is the new top (or -1). Add `depths[mid] * (mid - prevSmaller) * (i - mid)`. Then push `i`. Each index is pushed and popped once: O(n) time, O(n) space. This single-pass form computes both boundaries without two arrays.

## C++ walkthrough
Use `long long` for `(mid - prev) * (i - mid)`, which reaches 2.5 * 10^9 and overflows `int`, then reduce modulo `1e9 + 7` before multiplying by the depth, so the product stays below 10^18. Accumulate in a `long long` and reduce every iteration. Loop `i` up to and including `n` and read the depth as `0` at `n` to flush the stack (all real depths are at least 1).

## Common bugs
Using `>` and `>=` the same way on both sides, which double counts equal depths; storing the product in an `int`; forgetting the modulus or applying it only at the very end; forgetting to flush the stack after the loop; counting the stretch lengths off by one (`left` and `right` include the element itself).

## Follow-ups
Sum of subarray *maximums*; sum of subarray ranges (max minus min), solved as two such sums; count subarrays where the minimum is at least `k` (a different, window-based question).

## Similar problems
Sum of Subarray Minimums (LeetCode 907) is this problem. Daily Temperatures (LeetCode 739) uses the same stack with a simpler answer, and Largest Rectangle in Histogram (LeetCode 84) uses the same boundaries for area.
