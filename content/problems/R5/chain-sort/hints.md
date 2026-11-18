## Nudge
Arrays can be sorted by swapping because you can jump anywhere. A list cannot be indexed, but it *can* be cut in two and two sorted lists can be joined cheaply. Which sorting algorithm is built from exactly those two moves?

## Approach
Merge sort. Use fast and slow runners to find the end of the first half, cut the list there, sort both halves recursively, then merge the two sorted halves with a dummy head. Stop when the list has zero or one node.

## Key insight
Merging two sorted lists needs no extra memory (you just re-link nodes), and finding the middle costs one pass. Each of the log n levels does O(n) work, so the total is O(n log n) with only the recursion stack as extra space.
