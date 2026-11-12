## Nudge
When a new rock arrives, which earlier rocks could it possibly hit? Only a right-moving rock can be hit, and only the nearest one first.

## Approach
Keep a stack of survivors. For each new rock: while it moves left and the top of the stack moves right, they collide. If the top is smaller, pop it and keep going; if it is equal, pop it and the new rock is gone; if the top is bigger, the new rock is gone. If the new rock is still alive afterwards, push it.

## Key insight
A new rock can only ever interact with the top of the stack, and every collision removes at least one rock, so each rock is pushed once and popped at most once. Use `while`, not `if`: one big left-mover can plough through many right-movers.
