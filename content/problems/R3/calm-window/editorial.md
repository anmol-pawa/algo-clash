## Signals
"Longest contiguous stretch" with a condition that only gets harder as the stretch grows (more letters can only add distinct values) is a sliding window.

## Brute force
For every start, extend to the right while the distinct count is at most `k`, tracking the best length. O(n^2) time, O(1) space (a 26-slot count array). With n = 100000 and few distinct letters this does billions of steps.

## Key insight
Calmness is monotone: removing letters from a calm stretch keeps it calm. So when the window becomes too diverse you only ever need to move its left edge forward, never restart.

## Optimal
Maintain `count[26]` and `distinct` for the window `[left, right]`. Add `s[right]`; if its count went 0 to 1, increment `distinct`. While `distinct > k`, remove `s[left]` (decrement; if it hits 0, decrement `distinct`) and advance `left`. After this the window is calm, so record `right - left + 1`. Invariant: after each step the window is the longest calm stretch ending at `right`. Each index is added once and removed at most once: time O(n), space O(1) (26 counters).

## C++ walkthrough
A fixed `int count[26]` beats a hash map here: no hashing, no allocation. The shrink is a `while` loop so the window is calm before we measure it. The result is an `int` because it never exceeds n <= 100000.

## Common bugs
Forgetting to update `distinct` when a count returns to zero; measuring the window before it is calm again; returning the final window length instead of the maximum seen.

## Follow-ups
What if the alphabet is Unicode or large? Use a hash map for counts (still O(n) expected). Return the stretch itself, not just its length. Count how many calm stretches exist (add `right - left + 1` each step).

## Similar problems
Longest Substring with At Most K Distinct Characters (LeetCode 340, premium); Longest Substring Without Repeating Characters (LeetCode 3) is the same idea with "distinct equals length".
