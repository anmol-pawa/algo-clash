## Nudge
If a stretch is tidy, is every stretch inside it tidy too? What does that suggest when a stretch stops being tidy?

## Approach
Grow the stretch one letter at a time on the right. If the letter you just added now appears more than `m` times, move the left edge forward until it appears at most `m` times again.

## Key insight
Keep 26 counts. Only the newly added letter can break the rule, so the shrink loop only needs to wait for that one count to drop. It must be a `while`, not an `if`: the letter leaving on the left is often a different letter. Each index enters and leaves once, so the scan is O(n).
