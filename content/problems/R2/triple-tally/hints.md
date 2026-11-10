## Nudge
Fixing one crate leaves a two-crate problem: find two values that sum to its negation. Sorted data makes that cheap.

## Approach
Sort. For each smallest value `nums[i]`, run two pointers over the rest: move the low one up when the sum is too small, the high one down when too large. When it hits zero, count it and step both past repeated values. Skip a repeated `nums[i]` too.

## Key insight
De-duplicating the three positions (smallest, middle, largest) separately is what makes each distinct trio counted exactly once.
