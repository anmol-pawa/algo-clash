## Signals
"Count the stretches with exactly k of something." Counting (not maximising) plus an exact target is the cue for the "at most k minus at most k - 1" trick. A plain window cannot count exact matches because shrinking from the left can move you from "too many" straight past "exactly k".

## Brute force
For every start, extend to the right while counting odd numbers and count each stop where the count equals `k`. O(n^2) time, O(1) space; for `n = 100000` with few odd numbers that is about 5 * 10^9 steps.

## Key insight
The set of stretches with at most `k` odds is monotone under shrinking, so a window can count them in O(n). The stretches with exactly `k` odds are those with at most `k` minus those with at most `k - 1`.

## Optimal
`atMost(limit)`: slide `right`; add its parity; while the odd count exceeds `limit`, drop from the left; add `right - left + 1` (every start in the window works for this right end). Return `atMost(k) - atMost(k - 1)`, with `atMost(-1) = 0`. Time O(n), space O(1). Each call proves its own correctness: the window for a given right end is the longest valid stretch ending there, and shorter starts stay valid.

## C++ walkthrough
`nums[i] & 1` is the parity without a branch (values are positive, but it also works for negatives in two's complement). The total uses `long long`: with 100000 cards the answer can be about 5 * 10^9. `atMost` is a `static` private helper taking `const vector<int>&` so the input is not copied twice. `odds -= nums[left++] & 1` drops and advances in one step.

## Common bugs
Counting one stretch per right end (misses the even cards that can sit before the first odd); returning `atMost(k)` alone; an `int` total that overflows; forgetting the `limit < 0` guard when `k = 0` is allowed; using `if` instead of `while` for the shrink.

## Follow-ups
Allow `k = 0` (all-even stretches). Solve it with prefix counts and a frequency table instead (count previous prefixes with odd-count `p - k`). Apply the same trick to "exactly K different integers" (the hard version in this region). Return the stretches' endpoints for the smallest one.

## Similar problems
Count Number of Nice Subarrays (LeetCode 1248), Subarrays with K Different Integers (LeetCode 992).
