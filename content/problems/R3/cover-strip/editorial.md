## Signals
"Shortest stretch that contains everything required", where the requirement is a multiset of letters. Growing the stretch never breaks a cover and shrinking can, which is the monotone shape that lets two pointers replace trying every start. The repeats in `charms` (`"aab"` needs two `a`) rule out a plain set of letters.

## Brute force
For every start, extend to the right until the stretch covers, remember the shortest. O(n^2) time even with an O(1) coverage check (a `missing` counter), O(1) extra space. With `n = 100000` and the last needed letter at the very end of the tape, every start scans to the end: about 5 * 10^9 steps.

## Key insight
If `[l, r]` covers, then `[l, r']` covers for every `r' >= r`. So for each right end there is a largest `l` such that `[l, r]` still covers, and that `l` never decreases as `r` grows. Two pointers that only move forward visit each position twice.

## Optimal
`need[c]` starts as the number of copies of `c` the charms ask for. Adding a letter does `need[c]--`; if it was positive the letter was really needed, so `missing` drops by one. When `missing == 0` the window covers: record it if it is strictly shorter than the best so far, then drop `tape[left]` (`need[c]++`; if it becomes positive we lost a needed copy and `missing` rises) and advance `left`. Time O(n + m), space O(1) (a 128-entry table).

## C++ walkthrough
`array<int, 128>` indexed by `static_cast<unsigned char>(ch)` avoids negative indices if `char` is signed. The trick `need[c]-- > 0` reads the old value and decrements in one step; counts at or below zero mean spare copies. `bestLen = n + 1` is a sentinel for "none found", and `tape.substr(bestStart, bestLen)` is only called when a cover exists. Strict `<` keeps the leftmost of equal lengths because the leftmost cover is found first.

## Common bugs
Treating `charms` as a set (the answer for `"aab"` needs two `a`); using `<=` so the rightmost of equal covers wins; returning the first covering prefix without shrinking; shrinking before the window covers; calling `substr` with the sentinel when nothing covers; checking coverage by scanning the whole table each step and still being fine, but doing it per start and timing out.

## Follow-ups
Return the length only, or every shortest cover. Allow arbitrary bytes (use `unordered_map`). Count the covering stretches instead (for each right end add `left_max + 1`). Do the same on a stream where you cannot go back.

## Similar problems
Minimum Window Substring (LeetCode 76).
