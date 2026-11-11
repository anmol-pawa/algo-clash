## Signals
"Shortest run with sum at least a target" looks like a sliding window, but the values can be negative. The window needs monotonicity: adding an element must not decrease the sum and removing one must not increase it. Negatives break both, so the plain two-pointer pass gives wrong answers. The cue to switch is "contiguous, sum condition, negatives allowed": go to prefix sums.

## Brute force
For each start, extend to the right until the sum reaches the quota (stop at the first hit, since longer is never better). O(n^2) time, O(1) space. If no run reaches the quota (say every change is -1), every start scans to the end: about 5 * 10^9 additions at `n = 100000`.

## Key insight
With `prefix[0] = 0` and `prefix[k] = change[0] + ... + change[k-1]`, a run from start `s` to end `e` (`s < e`) has sum `prefix[e] - prefix[s]`. We want the smallest `e - s` with `prefix[e] - prefix[s] >= quota`. Fix `e`. A start `s` is useless in two situations. (1) It already satisfied some earlier end `e'`: every later end is farther away, so `s` can only give longer runs than the one just recorded. (2) A newer start `s' > s` has `prefix[s'] <= prefix[s]`: `s'` is closer and gives a sum at least as large, so `s` can never win.

## Optimal
Maintain a deque of start indices whose prefix values strictly increase from front to back. For each end `e` from 0 to `n`: while `prefix[e] - prefix[front] >= quota`, record `e - front` and pop the front (rule 1); then while `prefix[back] >= prefix[e]`, pop the back (rule 2); push `e`. Each index is pushed and popped once: O(n) time, O(n) space for the prefix array and the deque.

## C++ walkthrough
`prefix` is `vector<long long>`: `n * max|change| = 10^10` does not fit in `int`, and `quota` is already `long long`. The front check is a `while`, not an `if`: after popping one start, the next start may also satisfy the quota at the same end. The deque stores indices rather than values because the answer is a length. The sentinel `best = n + 1` means "no run", and is converted to `-1` at the end. The first loop runs on the front, the second on the back; keep their order, since pushing before checking the front would allow an empty run (`e - e = 0`).

## Common bugs
Using the positive-numbers window (wrong when a negative appears inside the best run or makes a prefix of the window drag the sum down); never popping dominated starts from the back; recording the front without popping it; an `if` instead of `while` on the front; `int` prefix sums that overflow on large inputs; returning `0` for "no run" instead of `-1`; the O(n^2) per-start scan.

## Follow-ups
Positive values only: the plain window is enough, and the deque is not needed (compare with Tight Patch). Longest run with sum at least the quota (a different structure: monotone stack of prefixes plus binary search). Count the runs instead (needs an ordered or Fenwick structure). Return the start index too, with ties going leftmost.

## Similar problems
Shortest Subarray with Sum at Least K (LeetCode 862), Maximum Sum Circular Subarray (LeetCode 918, same prefix + deque idea), Constrained Subsequence Sum (LeetCode 1425).
