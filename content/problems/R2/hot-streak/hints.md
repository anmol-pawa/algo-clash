## Nudge
Trying every start and end is O(n^2). Instead ask: for each day, what is the best stretch that **ends** exactly on that day?

## Approach
Keep `endingHere`. On day `i` you either extend yesterday's best stretch or start fresh at day `i`. Track the maximum `endingHere` ever seen.

## Key insight
Extending is only worth it if the previous stretch's total is positive: `endingHere = max(gains[i], endingHere + gains[i])`. Initialise from `gains[0]`, not 0, so an all-loss input returns the least bad day.
