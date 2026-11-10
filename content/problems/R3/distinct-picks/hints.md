## Nudge
"Exactly k" is awkward for a window because shrinking can jump from "too many colours" straight past "exactly k". Is there a nearby question that a window answers cleanly?

## Approach
Count the stretches with at most `limit` colours using a window: for each right end, every start from `left` to `right` is valid, so add `right - left + 1`. Answer = `atMost(k) - atMost(k - 1)`.

## Key insight
The set "at most `limit` colours" is closed under shrinking, so two forward-only pointers count it in O(n). Subtracting the stretches with at most `k - 1` colours leaves exactly `k`. The total can reach about n^2 / 2, so keep it in a `long long`, and return 0 when the limit is not positive.
