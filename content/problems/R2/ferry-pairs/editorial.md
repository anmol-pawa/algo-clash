## Signals
"At most two per group" with a capacity limit: the pairing structure is the key, and sorted order gives a natural greedy for matching extremes.

## Brute force
Recursively decide, for the first unplaced rider, whether they ride alone or with each possible partner; take the minimum. Exponential, usable only for tiny inputs (it is the brute force in this package's tests).

## Key insight
Exchange argument. Let `h` be the heaviest rider and `l` the lightest. If `h + l > limit`, then `h` fits with nobody, so `h` rides alone. Otherwise take any optimal plan in which `h` and `l` are on different trips: `h` rides with `y` (or alone) and `l` rides with `x` (or alone). Re-pair them as `(h, l)` and `(x, y)`. The first pair fits by assumption, and `x + y <= h + y <= limit` because `h` is the heaviest, so the trip count does not grow. The first case removes one rider, the second removes two; the same argument applies to the rest.

## Optimal
Sort. `light = 0`, `heavy = n - 1`. While `light <= heavy`: if `light < heavy` and `weights[light] + weights[heavy] <= limit`, advance `light`; always decrement `heavy` and add one trip. Invariant: riders outside `[light, heavy]` are already carried in the counted trips. Time O(n log n) for the sort plus O(n) for the sweep; space O(1) extra.

## C++ walkthrough
The condition `light < heavy` stops the last rider being "paired with themselves" when both pointers meet. Two weights up to 10^9 sum to 2 x 10^9, which still fits in a 32-bit `int` (max about 2.147 x 10^9); if the constraint were larger, widen to `long long`.

## Common bugs
Pairing only adjacent sorted riders; dropping the light rider when the pair does not fit; letting a trip hold three riders; forgetting the `light < heavy` guard so one rider is counted as a pair.

## Follow-ups
What if a boat holds at most k riders? (It becomes bin packing, which is NP-hard in general.) What if riders arrive online? Return the actual pairing.

## Similar problems
Boats to Save People (LeetCode 881).
