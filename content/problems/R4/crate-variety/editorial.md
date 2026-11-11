## Signals
"Longest contiguous stretch with at most K distinct things" is a variable sliding window whose state is a frequency map. The state cannot be a single integer, so the hash map is part of the invariant.

## Brute force
For each start, extend to the right with a set until it exceeds `k` kinds. O(n²) time in the worst case (few kinds, long runs), O(k) space.

## Key insight
If a window has at most `k` kinds, every sub-window does too. So for each right end there is a smallest valid left end, and that left end never moves backwards as the right end advances. Two pointers visit each crate at most twice.

## Optimal
Maintain `inBag[kind]` = count in the window. Add `kinds[right]`; while `inBag.size() > k`, remove `kinds[left]` (erase the key when its count hits 0) and advance `left`. Update the answer with `right - left + 1`. Time O(n) expected, space O(k). With `k = 0` the window is always emptied, so the answer is 0.

## C++ walkthrough
`inBag.size()` counts keys, so zero counts must be erased. `unordered_map` is expected O(1) per operation; an adversary can craft integer keys that collide in some implementations, so for hostile inputs use a custom hash or a sorted compression of the codes to a dense array.

## Common bugs
Leaving zero-count keys in the map; testing `== k` instead of `<= k`; mishandling `k = 0` or an empty array.

## Follow-ups
Exactly K kinds: compute at-most(K) minus at-most(K-1) for counting subarrays. Stream version: what if the crates arrive forever and you only need the current best?

## Similar problems
Longest Substring with At Most K Distinct Characters (LeetCode 340); Fruit Into Baskets (LeetCode 904) is the `k = 2` case.
