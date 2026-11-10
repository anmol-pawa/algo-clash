## Signals
"Count the stretches with exactly k different values." Counting plus an exact number of kinds is the cue for the "at most k minus at most k - 1" trick. A single window cannot count exact matches: when the window has k colours, the valid starts for this right end are a range whose lower end needs a second pointer.

## Brute force
For every start, extend to the right while tracking the set of colours and count each stop where the set size equals `k`. O(n^2) time (times log n with `std::set`), O(n) space. With few colours and `k` at least the number of colours, every start extends to the end: about 5 * 10^9 steps for `n = 100000`.

## Key insight
Stretches with at most `limit` colours are closed under shrinking, so for each right end the valid starts form one contiguous range `[left, right]`, and `left` never moves backward. Stretches with exactly `k` colours are those with at most `k` minus those with at most `k - 1`.

## Optimal
`atMost(limit)`: keep `count[colour]` and `kinds`. Add `beads[right]`; while `kinds > limit` remove from the left; add `right - left + 1`. Return `atMost(k) - atMost(k - 1)`, with `atMost(0) = 0`. Time O(n), space O(n) for the count table (colours are at most 100000, so an array replaces a hash map).

## C++ walkthrough
`count[beads[right]]++ == 0` tests "first copy" and increments in one step. The total is `long long`: a row of identical beads with `k = 1` has n(n+1)/2 stretches, about 5 * 10^9. `atMost` is a `static` helper taking `const vector<int>&` so nothing is copied. The `limit <= 0` guard makes `atMost(0) = 0` explicit (the window would also give 0, but it skips a pointless scan and an allocation).

## Common bugs
Returning `atMost(k)` (that includes stretches with fewer colours); an `int` total that overflows; adding only one stretch per right end instead of `right - left + 1`; resetting the count table inside the loop; extending from every start and timing out.

## Follow-ups
Do it with only a single pass using two left pointers (the "shortest and longest valid left end" approach). Colours up to 10^9 (use `unordered_map` or compress first). Report the longest k-coloured stretch instead of counting.

## Similar problems
Subarrays with K Different Integers (LeetCode 992), Count Number of Nice Subarrays (LeetCode 1248).
