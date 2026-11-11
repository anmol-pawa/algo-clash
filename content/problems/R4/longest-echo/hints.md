## Nudge
Suppose a block of length 7 occurs twice. Does a block of length 6 occur twice? Does length 8? What does that tell you about how to search for the longest length?

## Approach
Binary search on the length L. For a fixed L, slide a rolling hash across the strand: one O(1) update per position, store each block's hash in a map, and stop when a hash is already there. Move to a longer L if a repeat was found, otherwise a shorter one.

## Key insight
"Repeats at L" is monotone: if it repeats at L it repeats at L-1 (drop the last letter of both copies). That makes the check a yes/no predicate you can binary search, so the total is O(log n) rounds of an O(n) scan. Hashes can collide, so confirm a hash match by comparing the two blocks before you trust it.
