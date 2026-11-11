## Signals
"Rename symbols" and "same shape" mean the actual symbols do not matter, only the pattern of repeats. That pattern is a canonical form, and comparing canonical forms is a hash design problem.

## Brute force
For every pair of positions `(i, j)`, require `a[i] == a[j]` exactly when `b[i] == b[j]`. This is correct but O(n²) time, too slow for 100,000 characters.

## Key insight
The pairing is valid iff it is a bijection between the symbols that occur. Two symbols that must be paired always first appear at the same index, and every later appearance of one is an appearance of the other. Tracking the last position of each symbol in each string checks that without building the maps explicitly.

## Optimal
Keep `lastA[symbol]` and `lastB[symbol]`, both starting at 0. At index `i`, if `lastA[a[i]] != lastB[b[i]]` the two symbols disagree about their history, so return `false`. Otherwise set both to `i + 1`. Time O(n); space O(1) because the alphabet is fixed (128 slots per string).

## C++ walkthrough
Index the arrays with `unsigned char` so a negative `char` can never produce a negative index. Storing `i + 1` keeps 0 free to mean "never seen". A pair of `unordered_map<char,char>` (forward and reverse) is the more explicit version and works for any alphabet.

## Common bugs
Only checking the forward mapping; storing `i` instead of `i + 1` so the first position collides with "never seen"; forgetting the length check when lengths can differ.

## Follow-ups
Group a list of words by their twin class: the key is the first-occurrence-index pattern (`"paper"` becomes `0,1,0,2,3`). Match a word pattern against a sentence of words: same idea with words as symbols.

## Similar problems
Isomorphic Strings (LeetCode 205) is this problem; Word Pattern (LeetCode 290) is the same bijection over words.
