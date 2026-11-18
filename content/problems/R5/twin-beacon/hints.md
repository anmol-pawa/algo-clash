## Nudge
You may not sort, mark or count, so the array itself is all you have. Every value is a valid index. What if each index pointed to the index stored in it?

## Approach
Treat `i -> beacons[i]` as a `next` pointer. Index 0 is never a value, so nothing points to it, and the walk from 0 must eventually repeat a node: it enters a cycle. Run the fast and slow runners from index 0 until they meet, then restart one runner at 0 and move both one step at a time. They meet at the cycle entry.

## Key insight
The cycle entry is the only node with two incoming pointers, that is, the only value stored at two different indices: exactly the duplicate. This is Loop Gate hiding inside an array, in O(n) time and O(1) space with the array untouched.
