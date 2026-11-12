## Nudge
After a pop, the old lowest reading may be gone. What would you need to have remembered at the moment each reading was pushed so that the answer is simply waiting for you?

## Approach
Store, with every reading, the lowest reading on the stack up to and including it. Pushing computes `min(val, lowest of the item below)`. `low()` reads the top item's stored lowest; `pop()` discards the pair, and the stored value of the new top is automatically right.

## Key insight
The stack only changes at the top, so a summary of "everything below and including me" never goes stale. A single `min` variable breaks on pop, and a side stack that skips duplicates of the minimum breaks when two equal minimums are stacked.
