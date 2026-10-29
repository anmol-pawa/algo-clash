## Nudge
If a stretch is calm, is every smaller stretch inside it calm too? What does that let you do when it stops being calm?

## Approach
Grow a window to the right one letter at a time. When it has too many different letters, move the left edge forward until it is calm again.

## Key insight
Keep a count per letter and the number of letters with a non-zero count. Each index enters and leaves the window at most once, so the whole scan is linear. Shrink in a loop: dropping one character does not always remove a letter from the window.
