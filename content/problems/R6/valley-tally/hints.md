## Nudge
There are about n^2/2 stretches, far too many to list. Instead of asking "what is the low of each stretch?", ask "for this one step, in how many stretches is it the low?"

## Approach
For each position `i`, find how far you can extend left before meeting a smaller depth, and how far right before meeting a smaller (or equal) depth. If there are `L` choices for the left end and `R` choices for the right end, step `i` is the low of `L * R` stretches and contributes `depths[i] * L * R`. A monotonic stack finds both boundaries for every position in one pass.

## Key insight
Ties need a rule, or equal depths are counted twice. Use "strictly smaller on the left, smaller-or-equal on the right": then the **rightmost** lowest step of a stretch owns it, and every stretch has exactly one owner. Reduce modulo after multiplying `L * R`, because `L * R * depth` can pass 10^18 only if you skip that reduction.
