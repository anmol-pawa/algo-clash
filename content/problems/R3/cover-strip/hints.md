## Nudge
Fix the right end of a stretch and ask: what is the best (rightmost) left end that still covers? If the right end moves forward, can that best left end ever move backward?

## Approach
Keep a window `[left, right]` and a table of how many copies of each letter are still missing. Move `right` forward, adding its letter. As soon as nothing is missing, record the window, then move `left` forward while the window still covers, recording each time it does.

## Key insight
Both ends only move forward, so each letter enters and leaves the window once: O(n + m) total. Track `missing` (the number of charm copies not yet covered) instead of comparing the whole table each step, and use a strict `<` on the length so that the leftmost of equally short covers is kept.
