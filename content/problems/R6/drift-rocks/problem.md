# Drift Rocks

Rocks drift along a single line, listed from left to right. Each entry of `rocks` is a nonzero integer: its **absolute value** is the rock's size and its **sign** is the direction (positive moves right, negative moves left). All rocks move at the same speed.

Two rocks collide only when a right-moving rock is somewhere to the left of a left-moving rock with nothing between them. The smaller one shatters; if both have the same size, both shatter. Rocks moving the same direction never meet, and a left-moving rock with no right-moving rock to its left drifts away safely.

Return the rocks that remain after all collisions, in their original left-to-right order.

## Examples

- `rocks = [4, 7, -3]` gives `[4, 7]`: the 3 hits the 7 and shatters.
- `rocks = [5, -5, 2]` gives `[2]`: equal sizes both shatter.
- `rocks = [3, 2, -9, 6]` gives `[-9, 6]`: the 9 breaks the 2, then the 3, and then runs out of rocks to hit.
- `rocks = [-2, -4, 8, 1]` gives `[-2, -4, 8, 1]`: nothing ever meets.

## Constraints

- `0 <= rocks.length <= 100000`
- `1 <= abs(rocks[i]) <= 1000000000`
