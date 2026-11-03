## Signals
A pointer moving around a ring with forward and backward turns is modular arithmetic. Any time a statement says "wrap around" or asks for an index "in range", expect the negative-modulo trap.

## Brute force
Move the pointer one slot at a time, wrapping at both ends. Correct, but O(|pos|) steps, which is up to 10^9 for the stated range, so it is only a reference for small values.

## Key insight
Turning `pos` slots lands on `pos mod m`. Mathematically that is a value in `[0, m)`, but C++ `%` truncates toward zero, so `-1 % 5` is `-1`, not `4`.

## Optimal
Compute `r = pos % m`, which lies in `(-m, m)`, then add `m` if `r` is negative. Time O(1), space O(1).

## C++ walkthrough
Since `|r| < m <= 10^5`, `r + m` cannot overflow `int`. The one-line form `(pos % m + m) % m` also works for the same reason; the branch form says what is happening. Avoid `abs(pos)` because it mirrors the direction and `abs(INT_MIN)` is undefined behaviour.

## Common bugs
Returning the raw `%` for negative `pos`; applying `abs` first (turns -1 into 1); computing `pos + m` before the remainder, which overflows near 2 * 10^9 in other variants of this problem.

## Follow-ups
Make the pointer start at an arbitrary slot. Handle `m` up to 2^31 - 1 with `long long` intermediates. Implement floor division with the same repair.

## Similar problems
Circular Array Loop (LeetCode 457) uses the same wrap-an-index trick.
