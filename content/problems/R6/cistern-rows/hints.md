## Nudge
Instead of asking "how much water sits above this one pillar", ask "which water becomes fixed the moment a taller pillar appears". Which earlier pillars does a new tall pillar close off?

## Approach
Scan left to right and keep a stack of pillar indices whose heights are non-increasing (each one waits for a wall on its right). When pillar `i` is taller than the one on top of the stack, that top pillar is the floor of a basin: the new pillar is its right wall, and the pillar now below it on the stack is its left wall. Add that basin's rectangle of water, then keep going.

## Key insight
The rectangle's width is `i - below - 1` and its depth is `min(height[i], height[below]) - height[floor]`. Each pillar is pushed and popped once, so one scan is enough. Add the product in a `long long`.
