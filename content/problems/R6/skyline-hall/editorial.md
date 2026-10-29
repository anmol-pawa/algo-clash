## Signals
"Best rectangle bounded by the shortest element in a stretch" asks, for each element, for the nearest smaller element on both sides. That is a monotonic stack question.

## Brute force
For each wall, expand left and right while neighbours are at least as tall, then multiply. O(n^2) time, O(1) space. A staircase of 100000 equal walls does about 5 billion steps.

## Key insight
Each wall is popped from the stack exactly once, and the moment it is popped we learn both of its blockers: the wall that popped it (right) and the new top beneath it (left).

## Optimal
Keep a stack of indices with non-decreasing heights. For each index `i` (plus a sentinel height 0 at `i = n`), while the stack top is taller than `heights[i]`, pop it as `top`; its height `h = heights[top]`, its left blocker is the new stack top (or -1 if empty) and its right blocker is `i`, so the width is `i - left - 1`. Update the best area with `h * width`. Push `i`. Invariant: stack heights never decrease, so everything below the top is a valid left blocker candidate. Each index is pushed and popped once: time O(n), space O(n).

## C++ walkthrough
Areas are `long long`: `10^5 * 10^9 = 10^14`. The loop runs to `i == n` with a virtual height 0 instead of a second flush loop. Equal heights are popped too (`>=`) or kept (`>`); both are correct, because the wider rectangle is found when the last equal bar pops.

## Common bugs
Forgetting to flush the stack after the last wall; computing the width with the popped index instead of `i - left - 1`; a 32-bit area that overflows; using the popped wall's own index as the left edge, which ignores taller walls already popped.

## Follow-ups
Largest rectangle of ones in a binary matrix: run this per row on running column heights. Solve it with divide and conquer on the minimum (O(n log n) with a segment tree). What if heights are real numbers?

## Similar problems
Largest Rectangle in Histogram (LeetCode 84); Maximal Rectangle (LeetCode 85) builds on it.
