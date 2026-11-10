## Signals
"Same letters, any order" means order is irrelevant and only letter frequencies matter: count frequency.

## Brute force
Sort both words and compare. O(n log n) time, O(1) extra space for an in-place sort. It is correct and fine for small inputs, but a count beats it.

## Key insight
Two words are scrambles exactly when their frequency vectors are equal. With a 26-letter alphabet the frequency vector is a fixed-size array.

## Optimal
If the lengths differ, return `false`. Otherwise add 1 for each letter of `a` and subtract 1 for each letter of `b` in a 26-slot array; the words are scrambles iff every slot is 0. Time O(n), space O(1) (26 counters, independent of n).

## C++ walkthrough
A plain `int balance[26]` is faster and simpler than a map, and `c - 'a'` maps a lowercase letter to its slot. The explicit length check is what makes "all slots zero" sufficient.

## Common bugs
Comparing letter sets (loses multiplicity); comparing sums of letter codes (collisions); checking only for negative slots without comparing lengths.

## Follow-ups
Unicode input: use `unordered_map<char32_t,int>`. Find all scrambles of a pattern inside a text: fixed-size sliding window with the same balance array.

## Similar problems
Valid Anagram (LeetCode 242) is this problem; Group Anagrams (LeetCode 49) groups many words by this relation.
