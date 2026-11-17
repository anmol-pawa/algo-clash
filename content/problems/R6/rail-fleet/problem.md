# Rail Fleet

Several trains share one single-lane track that ends at a depot at position `depot`. Train `i` starts at position `start[i]` (all different, all before the depot) and drives toward the depot at its own constant speed `speed[i]`.

Trains cannot overtake. When a faster train catches up with a slower train ahead of it, it slows down to the slower train's speed, and from then on the two travel bumper to bumper as one **convoy**. A convoy can keep growing as more trains catch up with it. A train that catches up exactly at the depot still counts as part of that convoy.

Return how many separate convoys arrive at the depot.

## Examples

- `depot = 20`, `start = [0, 4, 9, 13, 16]`, `speed = [5, 2, 3, 1, 4]` gives `3`.
- `depot = 10`, `start = [2, 6]`, `speed = [4, 1]` gives `1` (the rear train reaches the front one and slows down).
- `depot = 12`, `start = [6, 0]`, `speed = [1, 2]` gives `1` (both would arrive after exactly 6 hours).

## Constraints

- `0 <= start.size() == speed.size() <= 100000`
- `1 <= depot <= 1000000000`
- `0 <= start[i] < depot`, and all `start[i]` are distinct
- `1 <= speed[i] <= 1000000`
