## Nudge
Does the order of the letters matter, or only how many of each letter there are?

## Approach
Count the letters of `a` in 26 slots, subtract the letters of `b`, and check that every slot ends at zero.

## Key insight
Different lengths can never match, so check that first. With 26 fixed slots the memory does not depend on the input size.
