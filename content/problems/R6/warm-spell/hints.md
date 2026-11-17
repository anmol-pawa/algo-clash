## Nudge
Look at day `i` and the days before it that are still waiting for something warmer. When a new warm day arrives, which of those waiting days does it settle? Does it settle them in any particular order?

## Approach
Walk the days left to right and keep a stack of day numbers whose wait is not known yet. For each new day, while the day on top of the stack is colder than today, today is its answer: record the gap and pop. Then push today.

## Key insight
The temperatures of the waiting days can never rise from the bottom of the stack to the top, because a warmer day would have settled the colder one beneath it. So the days to settle are always on top, and each day is pushed once and popped once: O(n). Use a `while` loop, since one warm day can settle many waiting days at once.
