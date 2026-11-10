## Nudge
Sorting finds the chain easily but costs n log n. What if you could ask "is `x + 1` in the list?" in O(1) instead?

## Approach
Put all numbers in a hash set. Only start counting at a number whose predecessor `x - 1` is **not** in the set, then walk upward while `x + 1, x + 2, ...` are present.

## Key insight
Starting only at chain beginnings means every number is walked over at most once in total, so the loop is linear even though it looks nested.
