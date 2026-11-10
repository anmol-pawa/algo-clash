## Nudge
Building a cleaned copy and reversing it works, but it costs extra memory. Can you compare the original string with two fingers instead?

## Approach
Put one index at the start and one at the end. Move each inward past characters that do not count, then compare the two that do (ignoring case). Stop when the indices meet.

## Key insight
The pair of characters you compare are always the next-outermost ones that count, so a mismatch anywhere means the answer is `false`, and meeting in the middle means every pair matched.
