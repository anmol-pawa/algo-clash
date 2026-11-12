## Signals
Items on a line that cancel each other when they meet head-on, and the question asks what is left in order. The "most recent survivor" is the only one a new item can touch, which is a stack.

## Brute force
Repeatedly scan for the first adjacent pair (right-mover followed by left-mover), resolve it, delete the loser(s), and rescan from the start until no pair remains. Correct, but a big left-mover behind 50000 right-movers causes 50000 rescans plus array erases: O(n²) time, O(1) extra space.

## Key insight
Resolve collisions the moment a rock arrives. A new left-moving rock can only meet the nearest surviving right-mover before it, which is the top of the stack. Left-movers already on the stack have nothing to their left that moves right (or they would have collided), so they never interact with later rocks except as the stack's bottom.

## Optimal
For each rock `r` in order, let `alive = true`. While `alive`, `r < 0`, and the stack top is positive: compare sizes. If `top < -r`, pop and continue. If `top == -r`, pop and set `alive = false`. If `top > -r`, set `alive = false`. After the loop, push `r` if it is still alive. The stack is the answer, bottom to top. Invariant: the stack never contains a right-mover directly followed by a left-mover. Each rock is pushed once and popped at most once: O(n) time, O(n) space.

## C++ walkthrough
Use a `vector<int>` as the stack so the result needs no reversing. Test `kept.back() > 0` (not just non-empty) so left-movers stack up harmlessly on top of other left-movers. Compare `kept.back()` with `-r`, which is the size of a left-mover. Equal sizes remove the top as well; forgetting that leaves a ghost rock.

## Common bugs
`if` instead of `while` (the big rock only breaks one rock); comparing without checking directions, so two left-movers "collide"; on equal size, removing only the new rock; removing nothing on a tie; pushing the new rock after it has already been destroyed.

## Follow-ups
Different speeds per rock (then it becomes an event simulation with a heap). Return how many rocks shatter instead. Rocks on a circular track (no rock is "leftmost"; handle wrap-around by doubling the list carefully).

## Similar problems
Asteroid Collision (LeetCode 735) is this problem. Daily Temperatures (LeetCode 739) and Car Fleet (LeetCode 853) use the same one-pass stack.
