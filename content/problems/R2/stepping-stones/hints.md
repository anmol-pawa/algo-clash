## Nudge
Sorting works but costs O(n log n). Which stones are the only ones worth starting a walk from?

## Approach
Put every position in a hash set. A stone starts a path exactly when the position one below it is absent. From each such start, walk upward while the next position is present, and track the longest walk.

## Key insight
Because you only begin at path starts, every stone is stepped over by at most one walk, so the total work is linear. Skip the "is x-1 present?" test and a single long path is re-walked from each of its stones: O(n^2).
