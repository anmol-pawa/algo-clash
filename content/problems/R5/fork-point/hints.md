## Nudge
Two chains of different lengths meet at the fork, but if you start both walkers at the heads they arrive at the fork at different times. How could you make both walkers travel the same total distance?

## Approach
Let one walker go along `a` and then along `b`, and the other along `b` and then along `a`. Advance both one node at a time and stop when they are the same node (compare pointers, not values). If the chains never join they both end on `nullptr`, which is also "the same", so the loop stops and you return it.

## Key insight
Let `x` be the nodes only `a` owns, `y` the nodes only `b` owns, and `z` the shared nodes. Walker one covers `x + z + y` nodes before it enters the shared part for the second time, walker two covers `y + z + x`: the same distance, so they are standing on the same node exactly when they reach the fork. With `z = 0` they both reach `nullptr` after `x + y` steps.
