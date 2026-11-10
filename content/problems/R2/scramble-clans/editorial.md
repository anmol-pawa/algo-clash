## Signals
"Group by" a relation where order inside the item does not matter. The way in is a **canonical form**: one key per equivalence class.

## Brute force
For each word, compare it with every other word (sorting both). O(n^2 * L log L) time, O(L) space. With n = 20000 this is hundreds of millions of sorts.

## Key insight
Sorting a word's letters gives a key that is identical for every rearrangement and distinct for different letter multisets. Grouping then needs a single hash lookup per word.

## Optimal
For each word, sort a copy and increment its count in an `unordered_map<string,int>`; the answer is the largest count seen. Invariant: after processing a prefix of words, `clanSize[key]` is the clan size within that prefix, so the running maximum is the answer. Time O(n * L log L), with L <= 20 effectively O(n); space O(n * L) for the keys.

## C++ walkthrough
`for (string word : words)` copies on purpose, because we sort the copy and must not touch the input. `++clanSize[word]` inserts a zero count if absent and returns the new value, so the maximum update is one expression. For a tighter key, a 26-count array encoded as a string avoids the sort: O(n * L).

## Common bugs
Using length or letter sum as the key (collisions); sorting the input in place and then comparing against the original; returning the number of clans instead of the size of the largest.

## Follow-ups
Return the groups themselves, in input order. Use a 26-count key to drop the log factor. Huge words: hash the count vector rather than store it.

## Similar problems
Group Anagrams (LeetCode 49) asks for the groups; this asks for the largest size. Valid Anagram (LeetCode 242) is the pairwise test.
