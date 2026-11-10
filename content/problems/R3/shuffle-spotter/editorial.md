## Signals
"Does this stretch use the same letters in any order?" The stretch length is fixed (the word's length) and the property depends only on letter counts. Fixed length plus a count-based property is a fixed-size window with a frequency table.

## Brute force
For each start, copy the stretch, sort it and compare with the sorted word. O(n * m log m) time, O(m) space. With `n = 100000` and `m = 50000` that is about 50000 windows of 50000 letters sorted each, far beyond the limit.

## Key insight
Two multisets of letters are equal iff their 26 counters are equal. Sliding the window by one changes two counters, so the table can be kept up to date in O(1) and compared in O(26).

## Optimal
Build `need[26]` from the word. Walk `i` over the banner: add `text[i]` to `window`; if the window now holds more than `m` letters (`i >= m`), remove `text[i - m]`; once `i >= m - 1`, compare `window == need` and count a match. Time O(26 * n) which is O(n); space O(1).

## C++ walkthrough
`array<int, 26>` has value semantics and a built-in `operator==`, so `window == need` is one readable line; `{}` zero-initialises it. Use `ch - 'a'` as the index. Return `0` up front when `m > n`, otherwise the indices `i - m` and the full-window test need care. Cast `size()` to `int` before comparing or subtracting.

## Common bugs
Looping to `n - 1` and never checking the last window; removing `text[i - m - 1]` (off by one on the departing letter); comparing only which letters occur instead of how many (`"aab"` vs `"abb"`); counting windows before they reach full length; sorting every window and timing out.

## Follow-ups
Return the starting positions instead of the count. Keep a `matches` counter of letters whose counts agree, so each slide is O(1) instead of O(26). Allow any Unicode alphabet (use a hash map for counts). Allow at most one differing letter.

## Similar problems
Find All Anagrams in a String (LeetCode 438), Permutation in String (LeetCode 567).
