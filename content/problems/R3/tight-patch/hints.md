## Nudge
Every panel adds power, so adding a panel can only help and removing one can only hurt. How can you use that to avoid trying every start?

## Approach
Extend the right end one panel at a time. As soon as the total reaches `need`, the current patch works: record its length, then shrink from the left while it still works.

## Key insight
Shrinking is a loop, not a single step: one large newcomer can make several old panels unnecessary. Because all values are positive, the left edge never has to move back, so each panel enters and leaves once: O(n). Use `long long` for the total and a sentinel for "no patch yet".
