## Signals
"Count characters that satisfy a property" over a string is a single pass with a counter. The only decision is how to write the property test.

## Brute force
Search each character in a ten-character string of vowel spellings with `find`. That is O(n * 10), which is O(n) with a tiny constant, so the brute force and the reference differ in style rather than complexity.

## Key insight
Fold the case once, then test five letters. The scan has no state beyond the counter.

## Optimal
One pass, `count` incremented on each vowel. Time O(n), space O(1) (the string is passed by value here, so the call also copies it once).

## C++ walkthrough
`for (const char c : s)` is the range-for idiom; `const` documents that the loop does not modify the character. `tolower` lives in `<cctype>` and takes an `int` that must be representable as `unsigned char` (or `EOF`), hence the cast. An equally good alternative is `string("aeiouAEIOU").find(c) != string::npos`.

## Common bugs
Forgetting capitals; counting `y`; using `s.length() - 1` as the bound and skipping the last character; calling `tolower` on a possibly negative `char`.

## Follow-ups
Return the count of each vowel (`array<int, 5>`). Reverse only the vowels in place (two pointers). Count vowel substrings.

## Similar problems
Reverse Vowels of a String (LeetCode 345).
