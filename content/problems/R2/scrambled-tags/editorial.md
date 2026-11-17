## Signals
"Same letters rearranged" means the two strings have equal letter-frequency tables. Frequency questions are hash (or direct-address) lookups.

## Brute force
Sort both strings and compare: O(n log n) time, O(n) extra space for the copies. It is correct and short, and a good first answer; counting beats it asymptotically.

## Key insight
Order is irrelevant, so only the multiset of letters matters. A multiset over a 26-letter alphabet is a 26-slot array.

## Optimal
If the lengths differ, return `false`. Otherwise add one for each letter of `a` and subtract one for each letter of `b` in a single pass; the strings match iff all 26 slots end at zero. Time O(n), space O(1) (26 counters, independent of n).

## C++ walkthrough
`a[i] - 'a'` maps a letter to a slot; the `int balance[26] = {}` zero-initialises. The range-for over the array makes the final check one clear line. Taking the strings by value is fine here, though `const string&` would avoid the copy.

## Common bugs
Comparing letter sets instead of counts; skipping the length check; indexing with `a[i]` directly (an out-of-range index) instead of `a[i] - 'a'`.

## Follow-ups
The strings may contain any Unicode: use `unordered_map<char32_t,int>`. Group a whole list of words by anagram class (sorted word, or count signature, as the key). Allow `b` to be any sub-multiset of `a` (the "ransom note" variant).

## Similar problems
Valid Anagram (LeetCode 242); Ransom Note (LeetCode 383); Group Anagrams (LeetCode 49).
