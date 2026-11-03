## Signals
"Count each letter", a fixed small alphabet, and case-insensitive matching: a fixed-size count array replaces a map.

## Brute force
For each of the 26 letters, scan the whole string and count matches of the lower- and uppercase form. O(26 * n), fine for checking, and obviously correct.

## Key insight
`c - 'a'` turns a lowercase letter into a bucket index 0..25 because letters are contiguous in ASCII. Normalise case with `tolower` first, and check the range before indexing, since the characters just outside the ranges (`@`, `[`, `` ` ``, `{`) would produce out-of-bounds indices and undefined behaviour.

## Optimal
One pass with a 26-slot array. Time O(n), space O(1) (26 counters). This count-array trick is the base for anagram checks, window problems on lowercase letters and sorting by frequency.

## C++ walkthrough
`tolower` and `isalpha` come from `<cctype>` and take an `int` that must be representable as `unsigned char` (or `EOF`); a plain `char` that is negative is undefined behaviour, so cast first. `vector<int>(26, 0)` is 26 zeros. The subtraction `c - 'a'` promotes both operands to `int`, so it is a plain integer in `[0, 25]` after the guard.

## Common bugs
Ignoring uppercase; forgetting the range guard (digits and spaces index negative or past 25); an off-by-one in the upper bound (`< 'z'`); treating `'A'..'z'` as one contiguous block of letters (it contains six non-letters).

## Follow-ups
Check whether two strings are anagrams. Find the most frequent letter. Count letters in a sliding window of fixed length.

## Similar problems
Ransom Note (LeetCode 383), Valid Anagram (LeetCode 242).
