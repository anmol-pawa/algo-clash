## Signals
"Every block of exactly `k` consecutive items" is a fixed-size window. The block always has the same length, so consecutive blocks differ by one item entering and one leaving.

## Brute force
For each start index sum the next `k` readings. O(n * k) time, O(1) space; with `n = 100000` and `k` near `n / 2` this is about 2.5 * 10^9 additions and times out.

## Key insight
`total(i+1) = total(i) + readings[i + k] - readings[i]`. Keep the running total and update it in O(1) while sliding.

## Optimal
Sum the first `k` readings, record it as `best`, then for each later index add the new reading and subtract the one `k` places back, updating `best`. Time O(n), space O(1). The total is at most 10^8 in magnitude so `int` would fit, but `long long` keeps the habit for larger limits.

## C++ walkthrough
Use `LLONG_MIN` (or the first block's total) as the initial maximum, never `0`. Loop `i` from `k` so that `readings[i - k]` is always valid. A `const int n = static_cast<int>(readings.size())` avoids signed/unsigned comparison surprises.

## Common bugs
Starting `best` at `0` (wrong when every block is negative); dropping the wrong element (off by one in `i - k`); stopping the loop one block early; recomputing each block from scratch.

## Follow-ups
Return the average as a `double`. Return the start index of the best block. What if `k` can be larger than the list? (Decide and state the contract.) What changes for a circular list?

## Similar problems
Maximum Average Subarray I (LeetCode 643).
