## Nudge
You cannot index an array of a billion lockers, but you can squeeze every key into a small range with `key % B`. What happens when two keys land on the same number?

## Approach
Keep a vector of `B` buckets, each a short list of `(key, value)` pairs (separate chaining). `put` scans the bucket for the key and overwrites or appends; `get` scans; `remove` erases the matching pair. Track a running count. Choose `B` as a prime near the expected size.

## Key insight
Chains stay short only if the table grows with the data. When `count / B` passes a load factor (about 1), allocate twice as many buckets and re-insert everything. Each rehash costs O(n) but happens after geometrically spaced growth, so the amortised cost per `put` is O(1).
