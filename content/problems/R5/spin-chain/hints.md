## Nudge
Spinning a list by its length gives the same list back. So how many spins really matter? And if the list were a ring, where would you cut it to get the new front?

## Approach
Measure the length `n` and find the tail. Let `spins = k % n`. If it is zero, return `head`. Otherwise walk to the node at index `n - spins - 1`: that is the new tail. Its successor is the new head. Cut after it and link the old tail to the old head.

## Key insight
Rotation is a cut of the ring at a different place. One pass to measure, one partial pass to find the cut: time O(n), space O(1). The modulo is essential because `k` can be 2 billion. Use `k % n`, not `min(k, n)`.
