## Nudge
Comparing two strands letter by letter costs `len`. Four letters need only 2 bits each. How big a number is a strand of 31 letters?

## Approach
Encode each letter as 2 bits (`A=0, C=1, G=2, T=3`) and keep the current window as one integer: shift left by 2, add the new letter, and mask off the bits that belong to the letter that just left. Count each code in a hash map; the first time a code reaches a count of 2, add one to the answer.

## Key insight
With `len <= 31` the window fits in 62 bits, so the integer is an exact name for the strand: no collisions, no verification step. Use a 64-bit type; `len` above 16 overflows 32 bits. Count a pattern when its count first hits 2, not every time it repeats.
