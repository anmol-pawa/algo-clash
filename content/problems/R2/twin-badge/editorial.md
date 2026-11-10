## Signals
"Does any value repeat" is the textbook membership question: have I seen this before? Membership questions want a hash set.

## Brute force
Compare every pair of scans: O(n^2) time and O(1) space, about five billion comparisons at n = 100000. Sorting a copy and checking neighbours drops this to O(n log n) time and O(n) space, which is also a fine answer in an interview.

## Key insight
Twins only matter relative to scans that came earlier, so remembering earlier ids is enough; you never need to compare against the whole array again.

## Optimal
Keep an `unordered_set<int>`. For each badge, `insert` it; if the insert reports the key already existed, return `true`. If the loop ends, return `false`. Invariant: the set holds the ids of all scans before the current one. Time O(n) expected, space O(n) in the worst case when every id is distinct.

## C++ walkthrough
`insert` returns a `pair<iterator,bool>`; the `bool` is the "was newly added" flag, so `!insert(b).second` means a repeat. `reserve(n)` avoids rehashing during the loop. The early return keeps the best case fast.

## Common bugs
Comparing only neighbours without sorting first; limiting how far back you look; using the array value as an index into a bool array (ids reach 10^9 and may be negative).

## Follow-ups
Only a window of the last k scans matters (keep a set of size k). Values are in a small range [0, 1000]: a plain boolean array is faster. Memory is tight: sort in place and give up the O(n) extra space.

## Similar problems
Contains Duplicate (LeetCode 217); Contains Duplicate II (LeetCode 219) adds the window.
