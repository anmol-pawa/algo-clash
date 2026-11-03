## Nudge
Try `-1 % 5` on paper the way C++ computes it. Is the answer a valid slot?

## Approach
In C++ the result of `%` has the same sign as the left operand, so it lands in `(-m, m)`. You only need to repair the negative case.

## Key insight
`((pos % m) + m) % m` or an `if (r < 0) r += m` always lands in `[0, m)`. The remainder is below `m` in size, so adding `m` cannot overflow `int` here.
