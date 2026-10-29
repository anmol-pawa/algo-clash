## Nudge
What do you need to have seen already to know that the current number completes a pair?

## Approach
Walk left to right and remember how many times each value has appeared so far.

## Key insight
For each element, add the count of `target - x` seen before it, then record `x`. Use a 64-bit total.
