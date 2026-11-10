## Signals
"Longest run of consecutive values" with an O(n) requirement: sorting is the obvious route, but the order is irrelevant, so a hash set answers "is `x + 1` present?" directly.

## Brute force
Sort, remove duplicates and scan for the longest run. O(n log n) time, O(1) extra space. It is correct, but the statement asks for linear time. A cruder version starts a walk from every number and re-walks long chains: O(n^2).

## Key insight
A chain has exactly one beginning: the number whose predecessor is missing. If you only start walks there, every element is visited by at most one walk.

## Optimal
Insert every number into an `unordered_set`. For each number `x` with `x - 1` absent, count `x, x + 1, ...` while present and keep the maximum. Invariant: each chain is walked once, from its smallest member, so total work is the set size plus the sum of chain lengths, which is O(n). Time O(n) expected, space O(n).

## C++ walkthrough
Building the set from iterators collapses duplicates for free. Iterating over the set (not the vector) avoids re-checking duplicate values. `start + length` never overflows `int` here because values stay within 10^9 and chain lengths within 10^5.

## Common bugs
Starting a walk at every element (quadratic); letting duplicates reset a sorted-scan run; assuming `max - min + 1` is the answer.

## Follow-ups
Return the chain itself. Do it with union-find (merge `x` with `x - 1` and `x + 1`). What if numbers arrive in a stream and you must report the longest chain after each insert?

## Similar problems
Longest Consecutive Sequence (LeetCode 128) is this problem.
