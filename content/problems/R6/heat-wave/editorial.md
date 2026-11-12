## Signals
"For each day, how long until something bigger?" is the next greater element question with the distance as the answer. Anything left over at the end simply gets 0.

## Brute force
From each day scan forward until a hotter reading appears. Correct, but a strictly falling year of 100000 readings makes about 5 billion comparisons: O(n²) time, O(1) extra space.

## Key insight
Process days in order and remember only the days that are still waiting. They form a stack whose temperatures never increase from bottom to top, because a hotter day would already have resolved the colder one below it. A new day therefore resolves a suffix of the stack.

## Optimal
Keep a stack of indices. For each day `i`, while the stack is non-empty and `temps[top] < temps[i]`, set `wait[top] = i - top` and pop. Then push `i`. Invariant: temperatures on the stack are non-increasing. Each index is pushed once and popped at most once, so time is O(n); the stack and the answer use O(n) space.

## C++ walkthrough
Use `<` and not `<=` in the loop: an equal day is not hotter and must keep waiting (and then sits on the stack with its equal neighbour, which keeps the stack non-increasing, not strictly decreasing). Store indices, not temperatures, because the answer is a distance. Initialise `wait` to zeros so unresolved days need no extra pass.

## Common bugs
Using `<=`; using `if` instead of `while` so only one day resolves per step; returning the hotter temperature instead of the distance; storing temperatures on the stack and losing the index.

## Follow-ups
Return the *value* of the next greater element, or the *previous* greater instead (scan right to left, or flip the comparison). Make the array circular (Next Greater Element II): loop `2n` times with index `i % n`. Count the days until a *colder* day: flip the comparison.

## Similar problems
Daily Temperatures (LeetCode 739) is this problem. Next Greater Element II (LeetCode 503) and Online Stock Span (LeetCode 901) use the same stack.
