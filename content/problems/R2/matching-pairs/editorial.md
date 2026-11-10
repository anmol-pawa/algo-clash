## Signals
"Pair that adds up to a target" plus "have I seen the partner before?" is a hash lookup: the partner of `x` is fully determined, `target - x`.

## Brute force
Check every pair `i < j`. O(n^2) time, O(1) space; with n = 100000 that is about 5 billion checks.

## Key insight
For a fixed right coin the left partner's value is forced, so only its **frequency among earlier coins** matters. Counting by value turns the inner loop into one lookup.

## Optimal
Scan left to right with `seen[value] = count so far`. For each `x` add `seen[target - x]` to the answer, then increment `seen[x]`. Invariant: before processing coin `j`, `seen` describes exactly coins `0..j-1`, so each pair is counted once, at its right coin. Time O(n) expected, space O(n) for the map. The answer is a `long long` because n(n-1)/2 is about 5 * 10^9.

## C++ walkthrough
`unordered_map<int,int>` default-initialises missing counts to 0 on `operator[]`, but `find` avoids inserting keys we only query. `const auto it` keeps the lookup cheap and read-only.

## Common bugs
Inserting before looking up (a coin pairs with itself when `2x == target`); using `int` for the answer; counting distinct partners instead of how many earlier coins hold the partner value.

## Follow-ups
Return the pair of positions when exactly one pair exists (store the index instead of a count). If the array is sorted, two pointers use O(1) space. Counting triples is 3Sum territory.

## Similar problems
Two Sum (LeetCode 1) asks for the positions instead of the count; Two Sum II (LeetCode 167) is the sorted version.
