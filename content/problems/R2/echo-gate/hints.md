## Nudge
If an id repeats, which earlier position is the best one to compare with: the first, or the most recent?

## Approach
Keep a hash map from id to the last position where it appeared. At each position, if the id is in the map and the gap is at most `k`, the alarm rings.

## Key insight
Always overwrite the stored position with the newest one. The most recent earlier copy is the closest, so if it is too far away every older copy is too.
