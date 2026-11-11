## Signals
Letters on one side, words on the other, and "the same must stay the same, different must stay different": a bijection check, the same shape as Twin Scripts with strings as one side's symbols. Asking for the longest prefix turns a yes/no into "where does it first fail".

## Brute force
For each line `i`, compare it with every earlier line `j` and require `pattern[i] == pattern[j]` exactly when `words[i] == words[j]`. The first line that disagrees is the answer. O(n² · w) time, far too slow for 100,000 lines.

## Key insight
The pairing is consistent so far exactly when each letter has had one word and each word one letter. Remembering the partner of every letter and every word lets you decide line `i` from two lookups instead of `i` comparisons.

## Optimal
Walk `n = min(pattern.size(), words.size())` lines. Look up `pattern[i]` in `wordOf` and `words[i]` in `letterOf`. If either exists with a different partner, return `i`. Otherwise store both directions. If the loop ends, return `n`. Time O(n · w) for hashing words of length at most `w` (here `w <= 10`); space O(n · w) in the worst case, though at most 26 letters means `wordOf` holds at most 26 entries.

## C++ walkthrough
Use `find` once and reuse the iterator rather than `count` followed by `operator[]`, and note that `operator[]` on a missing key inserts it, which would hide a mismatch. Compare strings with `!=`, which checks length and bytes. Because the key type for `letterOf` is `std::string`, no custom hash is needed.

## Common bugs
Checking only letter to word; returning 0 or `-1` on failure instead of the failing index; forgetting that the lists can have different lengths, so the loop bound must be the minimum; writing `wordOf[pattern[i]]` before checking, which silently creates an empty-string entry.

## Follow-ups
Return the full yes/no for equal lengths (Word Pattern). Group many poems by their canonical pattern (first-occurrence indices as the key). Handle words that are not single-space separated.

## Similar problems
Word Pattern (LeetCode 290) is the yes/no version; Isomorphic Strings (LeetCode 205) is the same idea with characters.
