## Signals
"Longest run after changing at most `k` items." Reword it: the longest window containing at most `k` bad items (zeros), since each bad item can be fixed with one change. Contiguity plus a monotone budget is the variable sliding window again, this time counting one kind of element instead of letters.

## Brute force
Try every window and count its zeros. O(n^3), or O(n^2) with a running count and early break. For `n = 100000` with an effectively unlimited budget the quadratic version does about 5 * 10^9 steps.

## Key insight
A window can be made all-on iff `zeros <= budget`. Validity is preserved when shrinking, so a two-pointer scan that only moves right finds the longest valid window.

## Optimal
For each `right`, add `lamps[right]` to the zero count; while `zeros > budget`, remove `lamps[left]` (decrementing `zeros` if it was off) and advance `left`; record `right - left + 1`. Time O(n), space O(1).

## C++ walkthrough
No flipping is simulated. Compare with `==` against `0` and keep the zero count as an `int`. When `budget = 0` the window collapses to runs of ones, and an all-zero input gives `0`, which falls out of the loop naturally (the window becomes empty after each zero).

## Common bugs
`>=` instead of `>` in the shrink test (an off-by-one in the budget); forgetting to decrement the zero count when the dropped lamp was off; answering `ones + budget` (ignores positions); resetting the window when the budget is exceeded instead of sliding it.

## Follow-ups
Return the window's start. Do the same with a cost per flip (positive costs, total budget; still a window). Allow flipping in both directions with a budget for each. How does it relate to "Longest Repeating Character Replacement"?

## Similar problems
Max Consecutive Ones III (LeetCode 1004).
