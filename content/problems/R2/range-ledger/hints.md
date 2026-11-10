## Nudge
Re-adding the same crates for every question repeats work. What could you compute once, before any question arrives, so that each question becomes a couple of lookups?

## Approach
Build `prefix` where `prefix[i]` is the total of the first `i` crates. The total of crates `l..r` is the running total up to `r` minus the running total before `l`.

## Key insight
Use a prefix array of length `n + 1` with `prefix[0] = 0`; then the answer is exactly `prefix[r + 1] - prefix[l]` with no special case for `l = 0`. Store it as `long long`.
