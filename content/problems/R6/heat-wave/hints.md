## Nudge
Which days are still waiting for a hotter day once you reach day `i`? What do their temperatures look like, from the oldest waiting day to the newest?

## Approach
Keep a stack of day indices that have not found a hotter day yet. When today is hotter than the day on top, that day's wait ends today: record `i - top` and pop. Keep popping while today still beats the top, then push today.

## Key insight
The waiting days always have non-increasing temperatures, so only the top can be resolved first, and a warm day resolves a whole run of colder ones at once. Every day is pushed once and popped at most once.
