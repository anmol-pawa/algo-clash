## Nudge
"Exactly k" windows are awkward because shrinking can break them. "At most k" windows are not: a sub-window of a valid one is valid. Can you turn one into the other?

## Approach
Count the stretches with at most `k` odd numbers using a sliding window: for each right end, every start from `left` to `right` is valid, so add `right - left + 1`. Do the same for at most `k - 1` and subtract.

## Key insight
`exactly(k) = atMost(k) - atMost(k - 1)`. The total can be about n^2 / 2, so keep it in a `long long`, and handle `k - 1 < 0` (it counts nothing).
