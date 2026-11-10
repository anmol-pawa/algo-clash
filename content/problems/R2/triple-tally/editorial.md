## Signals
"Three values that sum to a target" with "distinct combinations" asked for. Reducing "three" to "one plus a pair" and sorting to make pair search linear is the classic two-pointer reduction.

## Brute force
Try every index triple, insert the sorted values into a set, and return its size. O(n^3) time: 4.5 billion trios at n = 3000, far beyond the limit.

## Key insight
After sorting, once the smallest value is fixed, the pair search is monotone: a sum that is too small can only be fixed by raising the low end, and one that is too large only by lowering the high end. That makes the pair search O(n) instead of O(n^2).

## Optimal
Sort. For `i` from the left: stop when `nums[i] > 0` (three positives cannot sum to zero); skip `i` when it equals the previous value. Set `lo = i + 1`, `hi = n - 1`. While `lo < hi`, look at `sum = nums[i] + nums[lo] + nums[hi]`: below zero, `++lo`; above, `--hi`; equal, count one trio and advance `lo` and `hi` past every copy of their current values. Invariant: every unseen trio with smallest value `nums[i]` lies inside `[lo, hi]`. Time O(n^2) after an O(n log n) sort; extra space O(1) beyond the sorted copy.

## C++ walkthrough
Accumulate the sum in `long long` out of habit; here three values within 10^5 fit comfortably in `int`, so state that you checked. Use `while (lo < hi && nums[lo] == a)` rather than a single `++lo` so a block of repeats is skipped in one go. Taking `nums` by value lets you sort without touching the caller's data.

## Common bugs
Counting repeats because only the first index is de-duplicated; advancing only one pointer after a hit and then re-finding the same trio; breaking at `nums[i] >= 0` and losing the `0, 0, 0` trio; skipping duplicates with `nums[i] == nums[i + 1]` instead of the previous element, which loses `-1, -1, 2`.

## Follow-ups
Return the trios themselves. Generalise to k-Sum with recursion (4Sum). Find the trio sum closest to a target (3Sum Closest). What changes if the array cannot be sorted?

## Similar problems
3Sum (LeetCode 15) returns the trios; this problem returns only their count.
