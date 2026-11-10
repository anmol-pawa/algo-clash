## Signals
"Shortest contiguous stretch with sum at least a target" and every value is positive. Positivity makes the sum monotone: extending never lowers it, shrinking never raises it. That is the green light for a variable sliding window.

## Brute force
For each start, extend until the sum reaches `need`. O(n^2) time, O(1) space; when `need` is unreachable (say a row of ones and `need = 10^9`) every start scans to the end, about 5 * 10^9 steps for `n = 100000`.

## Key insight
Panel outputs are positive, so prefix sums strictly increase. The shortest working patch ending at `right` starts at the largest `left` whose sum is still at least `need`, and that `left` never decreases as `right` grows. So both pointers only move forward.

## Optimal
Maintain `sum` of `power[left..right]`. After adding `power[right]`, while `sum >= need`: record `right - left + 1`, subtract `power[left]`, advance `left`. Return the best, or `0` when none. Time O(n), space O(1).

## C++ walkthrough
`need` can be up to 10^9 and the window sum up to 10^8; `long long` is the safe default for sums. Use `n + 1` as the sentinel for "not found" so a patch of full length `n` is still distinguishable. Remember that `vector::size()` is unsigned: cast before doing arithmetic with it.

## Common bugs
`if` instead of `while` for the shrink step; `>` instead of `>=`; returning the sentinel (or `n`) when no patch exists; resetting `left` to `right` after a success; using this approach when values can be negative (it breaks: see the Exact Stretches problem in Array Atoll, and the prefix-plus-deque problem later in this region).

## Follow-ups
What if values can be zero? (The same loop still works.) What if values can be negative? (Prefix sums with a monotonic deque.) Return the patch's position. Count all minimal patches.

## Similar problems
Minimum Size Subarray Sum (LeetCode 209).
