## Signals
"Find every occurrence" with overlap allowed, and a string long enough that per-step copies matter.

## Brute force
For every start position compare up to `m` characters with the phrase. O(n * m) with m at most 50, so about 10^7 steps at the limits. It is the checker and it is even fast enough here; the point of the problem is the idiomatic `find` loop and the copy trap.

## Key insight
To allow overlaps, restart the search one character after the previous match start. To keep it linear, do not create substrings: `find(pat, from)` searches in place. `substr` always allocates and copies its result, so slicing a suffix per iteration turns O(n) into O(n^2) bytes copied.

## Optimal
Loop on `find(pat, pos + 1)`. Time O(n * m) worst case but with `m <= 50` it is a small constant in practice, space O(1). (Linear-time matching with KMP or Z comes later, in the String Sea region, for when the phrase may be long.)

## C++ walkthrough
`find` returns the starting index of the first match at or after the given position, or `string::npos`. Because the return type is `size_t`, compare against `string::npos`, never `-1` stored in an `int`. `pat` is taken as `const string&` since it is read-only. The empty text case needs no special code: `find` simply returns `npos`.

## Common bugs
Advancing by `pat.size()` (loses overlaps); `substr(i)` per step (time limit); writing the window loop with `<` instead of `<=` and missing a match at the very end; computing `text.size() - pat.size()` in `size_t` when the phrase is longer than the text, which wraps around to a huge number.

## Follow-ups
Return the positions of all matches. Count matches of a phrase that may be as long as the text, using KMP. Count case-insensitively.

## Similar problems
Find the Index of the First Occurrence in a String (LeetCode 28).
