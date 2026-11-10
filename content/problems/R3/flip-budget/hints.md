## Nudge
Flipping a zero costs one unit of budget. A window of lamps can be made all-on exactly when it has at most `budget` zeros. What is the largest such window?

## Approach
Keep a window and a count of the zeros inside it. Add lamps on the right; if the zero count goes over the budget, move the left edge forward until it is back within budget.

## Key insight
The condition "zeros <= budget" is monotone: a sub-window of a valid window is valid. So the left edge never moves back and the scan is O(n). You never flip anything: you only count. The answer is the longest window ever seen within budget.
