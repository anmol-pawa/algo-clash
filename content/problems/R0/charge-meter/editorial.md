## Signals
"Stop at the first time a running total reaches a target", plus "ignore some items". The first calls for an early exit; the second calls for skipping an iteration. Together they are the textbook use of `break` / `return` and `continue`.

## Brute force
Compute the charge after every tick into an array, then scan that array for the first value that reaches the limit. It does the same work in two passes and is easy to trust.

## Key insight
Nothing after the first qualifying tick matters, so the loop can end there. Because negatives are skipped, the charge never decreases, so the first tick that reaches the limit is also the first tick at which it can be checked.

## Optimal
A single pass with an early exit. Time O(n) in the worst case (never reaching the limit), space O(1).

## C++ walkthrough
`continue` jumps to the next iteration without running the rest of the body. `return i` leaves the whole function, which here is the cleanest way to break out. The running total is `long long` because 10^5 readings of 10^9 reach 10^14. `limit` is also `long long`, so the comparison happens in 64 bits; comparing an `int` charge with it would still overflow before the comparison.

## Common bugs
Adding negative readings; `>` instead of `>=`; an `int` charge; returning `i + 1`; forgetting the `-1` for the case where the loop finishes.

## Follow-ups
Count how many readings were ignored before the trigger. Return the first index where the charge, including negatives, reaches the limit (a prefix-sum search). Handle a stream where readings arrive one at a time.

## Similar problems
Minimum Value to Get Positive Step by Step Sum (LeetCode 1413).
