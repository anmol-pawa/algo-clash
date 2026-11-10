## Signals
"Longest run of consecutive integers" in unsorted input with a linear-time demand: sorting is the obvious route, and the hash set is how you beat it. The signal is a question about neighbours by value (x, x+1), not by index.

## Brute force
Sort, remove duplicates and scan for the longest run of +1 steps. O(n log n) time, O(n) space (or O(1) if sorted in place). Correct, but not the linear solution the statement hints at; extending from every stone without a start check is O(n^2).

## Key insight
Each maximal run has exactly one smallest element, the only stone whose predecessor is missing. If you only extend from those, the extensions cover disjoint sets of stones.

## Optimal
Build `unordered_set<int>` of the positions. For each distinct x: if `x - 1` is in the set, skip. Otherwise count upward `x, x+1, ...` while present, and keep the maximum. Each stone belongs to one run, is walked once by that run's start, and is tested once as a potential start: time O(n) expected, space O(n) for the set.

## C++ walkthrough
Iterating over the set (not the vector) removes duplicates for free. `x + len` can reach about 10^9 + 10^5, inside `int` range (2.147 * 10^9); `x - 1` at -10^9 is safe too. The brute force widens to `long long` for its comparisons anyway.

## Common bugs
Treating a duplicate as a step (`v[i] - v[i-1] <= 1`); returning the last run instead of the best; omitting the predecessor check so a long path costs quadratic time; resetting the run length to 0 instead of 1 after a gap.

## Follow-ups
Do it with union-find over values (merge x with x+1) for an online version. Return the path itself. Stones arrive as a stream and you must report the longest run after each: maintain run lengths at the two ends of each run.

## Similar problems
Longest Consecutive Sequence (LeetCode 128); the union-find version reappears in the Union Isles region.
