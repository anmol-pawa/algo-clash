# Convoy Count

A single-lane road leads to a depot at mile `target`. Several trucks start at different miles, all driving toward the depot. Truck `i` starts at mile `position[i]` and drives at a constant `speed[i]` miles per hour.

Trucks cannot overtake. When a faster truck catches up with a slower one, it slows down and follows right behind, so from then on the two travel together at the slower truck's speed. A group of trucks travelling together is a **convoy**. A truck that never catches anyone is a convoy of its own. Catching up exactly at the depot also counts as travelling together.

Return the number of distinct convoys that arrive at the depot.

## Examples

- `target = 30, position = [4, 10, 16, 22], speed = [5, 3, 2, 1]` gives `1`. Each truck is faster than the one ahead and catches it before the depot, so all four end up in one convoy.
- `target = 30, position = [4, 10, 16], speed = [1, 2, 3]` gives `3`. Every truck ahead is faster, so nobody is ever caught.
- `target = 10, position = [5, 0], speed = [1, 2]` gives `1`. Both would reach the depot at hour 5, so they arrive together.

## Constraints

- `0 <= position.length == speed.length <= 100000`
- `0 <= position[i] < target <= 1000000000`, and all positions are distinct
- `1 <= speed[i] <= 1000000000`
- The trucks are given in no particular order.
