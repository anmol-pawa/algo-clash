## Signals
Counting pairs that sum to a target, with no ordering constraint, points to a hash lookup.

## Brute force
Try every pair of positions: O(n^2) time, O(1) space. Fine for tiny inputs only.

## Key insight
Pair each element with the earlier elements that complete it; a frequency map answers that in O(1).

## Optimal
One pass with a frequency map. Time O(n) expected, space O(n).

## C++ walkthrough
`seen` maps a value to how many earlier elements hold it; look up before inserting so an element never pairs with itself.

## Common bugs
Inserting before the lookup counts self-pairs; a 32-bit counter overflows on many equal values.

## Follow-ups
What if the array is sorted and memory is O(1)? Two pointers, handling runs of equal values.

## Similar problems
Two Sum (LeetCode 1) finds one such pair instead of counting them.
