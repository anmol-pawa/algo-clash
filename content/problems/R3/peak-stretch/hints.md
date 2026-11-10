## Nudge
Two neighbouring blocks of `k` minutes share almost all of their readings. How do their totals differ?

## Approach
Add up the first `k` readings once. Then move the block one minute at a time: add the new reading on the right and subtract the one that just left on the left.

## Key insight
Each slide costs O(1), so the whole scan is O(n) instead of O(n * k). Start `best` from the first block's total, not from 0, because every total can be negative.
