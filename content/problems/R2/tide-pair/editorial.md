## Signals
"Find two items that add up to a target" plus "seen before" is a hash lookup: you are really asking "does the missing partner exist among earlier elements?".

## Brute force
Try every pair (i, j) with i < j. That is O(n^2) time and O(1) space. At n = 100000 it performs about five billion additions, far past the limit.

## Key insight
For a fixed j the partner value is forced: `target - readings[j]`. A hash map answers "has that value appeared before, and where?" in O(1) expected time, so each hour needs only one lookup instead of a scan.

## Optimal
Walk j from left to right with a map `value -> earliest index`. Look up `target - readings[j]`; if present, return `{index, j}`. Otherwise insert `readings[j]` (keeping the earliest index). Invariant: the map holds exactly the values at hours before j. The first success has the smallest possible j, and the stored index is the smallest i for it. Time O(n) expected, space O(n) for the map.

## C++ walkthrough
`unordered_map<int,int>` with `find` then `emplace`: `emplace` does nothing when the key exists, which preserves the earliest index. The complement `target - readings[j]` stays within `int` because both operands are at most 10^9 in magnitude, so the difference is at most 2 * 10^9 < 2^31 - 1. The brute force adds in `long long` to be safe.

## Common bugs
Inserting the current value before the lookup (an hour pairs with itself, so `[5]`, target 10 wrongly succeeds); overwriting the stored index with the latest one (reports the wrong `i` for duplicates); returning the pair that starts earliest instead of finishing earliest.

## Follow-ups
The array is sorted: use two pointers in O(1) space. Return all distinct pairs. Count pairs instead (add the number of earlier matches). What if the stream never ends and you must answer online?

## Similar problems
Two Sum (LeetCode 1) asks for any valid pair of a guaranteed-unique solution; this version fixes a deterministic choice and allows no pair.
