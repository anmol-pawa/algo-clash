## Signals
"Count the contiguous stretches with a given sum" and the values may be negative. Because adding an element can decrease the sum, the window cannot be moved monotonically, which rules out two pointers. Prefix sums plus a hash map is the standard answer.

## Brute force
Fix the left end, extend the right end while accumulating, and count hits. O(n^2) time, O(1) space; about 5 * 10^9 steps at n = 100000, which times out.

## Key insight
With `prefix[k]` the sum of the first `k` numbers, stretch `(i, j]` sums to `target` iff `prefix[i] = prefix[j] - target`. So for each `j`, the number of valid left ends is the number of earlier prefixes with that value. Counting them needs the multiplicity, not just presence: several earlier prefixes can share a total.

## Optimal
Scan once, maintaining a map `seen` from prefix value to its count, initialised with `seen[0] = 1` (the empty prefix, which represents stretches starting at index 0). For each element: update `prefix`, add `seen[prefix - target]` to the answer, then increment `seen[prefix]`. Order matters: look up before inserting the current prefix, because a stretch must be non-empty. Time O(n) expected, space O(n).

## C++ walkthrough
`unordered_map::operator[]` inserts a zero if the key is missing, so use `find` for lookups that should not create entries (or accept the extra entries but know they exist). The answer can reach about 5 * 10^9, so both the map's value type and the counter should be 64-bit. The prefix itself is at most 10^8 in magnitude here but `prefix - target` can reach 1.1 * 10^9; keeping everything `long long` avoids reasoning about it.

## Common bugs
Forgetting the `{0: 1}` seed (misses stretches that begin at index 0); inserting the current prefix before the lookup (counts empty stretches when `target = 0`); using a set instead of counts; `int` for the answer; sliding window on arrays with negatives.

## Follow-ups
Return the longest such stretch (store first index instead of count). Make it work for a 2-D grid. What changes if the values are all positive? (Two pointers in O(1) space.) Count stretches whose sum is divisible by `k`.

## Similar problems
Subarray Sum Equals K (LeetCode 560).
