## Nudge
You only need to know whether you have met this id before. What structure answers "have I met X?" fastest?

## Approach
Walk the scans once, keeping a set of ids already seen. If the current id is already in the set, a twin exists; otherwise add it.

## Key insight
`set.insert(x).second` is false exactly when `x` was already there, so one call both tests and records. Alternatively sort a copy and compare neighbours: O(n log n), no extra hashing.
