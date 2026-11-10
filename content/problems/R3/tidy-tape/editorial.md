## Signals
"Longest contiguous stretch" plus a rule that gets harder to satisfy as the stretch grows and easier as it shrinks (a count limit). Any sub-stretch of a tidy stretch is tidy, so the condition is monotone: the textbook variable-size sliding window.

## Brute force
Try every start and end, count letters, check the limit. O(n^3) naively, O(n^2) if you stop at the first violation per start. The quadratic version still does about 5 * 10^9 steps for `n = 100000` when the limit is never hit, which times out.

## Key insight
Two pointers that only move right. When adding `tape[right]` pushes its count above `m`, the only way to repair the stretch is to drop letters from the left until that count is back to `m`. The left edge never needs to move backwards, because a smaller `right` already had its best answer recorded.

## Optimal
For each `right`, increment its letter's count; while that count exceeds `m`, decrement the count of `tape[left]` and advance `left`; then record `right - left + 1`. Each index is added once and removed at most once: O(n) time, O(1) space (26 counters).

## C++ walkthrough
`int count[26] = {}` zero-initialises the array. Index with `ch - 'a'`. Cast `size()` to `int` once for the loop bound. Use `while`, not `if`, for the shrink step.

## Common bugs
`if` instead of `while` (shrinks by one and leaves the window invalid); resetting the whole window when the limit is hit instead of dropping from the left; recording `right - left` (off by one); checking the limit on every letter instead of only the new one (still correct but slower to reason about).

## Follow-ups
Return the stretch itself (track the best `left`). Allow `m` to differ per letter. For a stream, what is the memory cost? Compare with "at most K different letters" (a distinct counter instead of a per-letter limit).

## Similar problems
Longest Substring Without Repeating Characters (LeetCode 3).
