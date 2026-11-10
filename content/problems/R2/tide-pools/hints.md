## Nudge
For one column, how much water sits above it? It depends on the tallest wall on each side, and only on the shorter of those two.

## Approach
Precompute the tallest wall to the left and to the right of every column and sum `min(left, right) - height`. Then notice you can do it with two pointers and two running maxima, no arrays.

## Key insight
Move the pointer at the lower end. Its side's running maximum is the true bound there, because the other side already has a wall at least as tall as that end, so the lower end's water level is its own side's maximum.
