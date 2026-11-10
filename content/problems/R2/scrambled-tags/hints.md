## Nudge
Two words are rearrangements of each other exactly when every letter occurs equally often in both. How could you tally that?

## Approach
Count each of the 26 letters in `a` and subtract the letters of `b`. If the lengths match and every tally ends at zero, the tags match.

## Key insight
A fixed `int[26]` is enough: no map, no sort, one pass. Check the lengths first; otherwise a shorter `b` that fits inside `a` would sneak through if you only test for negative counts.
