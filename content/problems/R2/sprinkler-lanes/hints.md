## Nudge
Applying each job lane by lane costs O(lanes) per job. Only the final levels matter, so can you record each job in O(1) and rebuild everything once at the end?

## Approach
Record, for each job, where its effect starts and where it stops, in a "change" array. Then sweep left to right keeping a running total; that total is the level of the current lane.

## Key insight
A job adds `v` at index `l` and subtracts `v` at index `r + 1` in the change array, so the running sum is `v` exactly on lanes `l..r`. Size the array `lanes + 1` so index `r + 1` is always valid, and use `long long`.
