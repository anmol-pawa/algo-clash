## Signals
"The same value again" combined with a distance limit is a hash lookup that remembers positions, not just membership.

## Brute force
For each position compare against the next `k` positions. O(n * k) time, O(1) space; with n and k near 100000 that is billions of comparisons.

## Key insight
Among all earlier copies of an id, only the **most recent** one can satisfy the distance limit if any does. So one position per id is enough.

## Optimal
Scan once with `lastSeen[id] = position`. At position `j`, if `id` is present and `j - lastSeen[id] <= k`, return `true`. Then store `j`. Invariant: `lastSeen` holds the latest position of every id in `0..j-1`. Time O(n) expected, space O(n).

## C++ walkthrough
`find` before assigning keeps the check separate from the update. Positions are `int` because n <= 100000. The values reach 10^9 so they fit `int` but sums never occur.

## Common bugs
Using `<` instead of `<=` for the gap; keeping the first position instead of the last; forgetting the distance entirely and answering "any duplicate".

## Follow-ups
Do it with O(k) memory by evicting ids that have left the window (a sliding window set). Return the earliest alarm position. Allow a value tolerance (near-duplicates need ordered buckets).

## Similar problems
Contains Duplicate (LeetCode 217) drops the distance limit; Contains Duplicate II (LeetCode 219) is this problem.
