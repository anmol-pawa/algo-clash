## Signals
`n + 1` values in the range `1..n` forces a repeat (pigeonhole), and the statement bans the easy tools: no modifying the input, no extra memory proportional to n. When values are valid indices into the same array, `i -> a[i]` is a functional graph, and "find the repeat" becomes "find where the walk loops".

## Brute force
Compare every pair: O(n^2), about 5 * 10^9 comparisons at 100000. Sorting a copy and scanning neighbours is O(n log n) but needs O(n) memory (sorting the original is banned). A hash set or a `vector<bool>` of seen values is O(n) time and O(n) memory. A summation trick (`sum - n(n+1)/2`) only works if the duplicate appears exactly twice, and the statement allows any number of copies.

## Key insight
Start at index 0 and repeatedly jump `i = a[i]`. Because every value is in `1..n`, the walk never returns to 0 and never leaves the array, so it must eventually revisit an index: it ends in a cycle. The cycle entry is the first node reached by two different predecessors, i.e. a value stored at two indices. That value is the duplicate.

## Optimal
Floyd's algorithm, exactly as in Loop Gate:
1. `slow = a[0]`, `fast = a[a[0]]`; advance `slow` by one and `fast` by two until they are equal.
2. Put `slow = 0`; advance both by one until they are equal. The common node is the cycle entry and the answer.

Why phase 2 works: let `a` be the distance from 0 to the entry, `L` the cycle length, and `b` the offset of the meeting point past the entry. At the meeting, slow has walked `a + b`, fast `2(a + b)`, and fast is a whole number of laps ahead, so `a + b = kL` and therefore `a = kL - b`: walking `a` steps from the meeting point lands on the entry, exactly where the restarted walker arrives. Time O(n), space O(1).

## C++ walkthrough
The parameter is a non-const `vector<int>&`, but the code only reads it. Both runners start one step in (`slow = a[0]`, `fast = a[a[0]]`) so the first loop test compares two different states; phase 2 then restarts `slow` at index 0, which keeps the `a` / `L` arithmetic above valid. Because every value is at most `n`, `a[a[fast]]` never indexes out of bounds on valid input; in an interview, say that this relies on the guarantee.

## Common bugs
Returning the meeting point of phase 1 (inside the cycle, not necessarily the entry); moving the restarted walker at double speed in phase 2; starting at index 1 instead of 0 for phase 2; using the sum formula when the value repeats more than twice; sorting the input; an O(n^2) pair scan.

## Follow-ups
Binary search on the value range (count how many readings are at most mid): O(n log n) time and O(1) space, and it also works when you must not build a graph; bit counting per bit position; find *all* duplicates when the array may be modified (swap each value to its own index, or negate); discuss why the statement's guarantee of exactly one repeated *value* matters.

## Similar problems
Find the Duplicate Number (LeetCode 287) is this problem. Linked List Cycle II (LeetCode 142) is the same algorithm on real nodes (Loop Gate here). Find All Duplicates in an Array (LeetCode 442) and Missing Number (LeetCode 268) are the modifiable-array cousins.
