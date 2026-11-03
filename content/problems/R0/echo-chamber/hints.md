## Nudge
Doing one multiplication per bounce would take 10^18 steps. How could one step handle many bounces at once?
## Approach
Bouncing `e` times is the same as bouncing `e / 2` times, squaring that strength, and bouncing once more if `e` is odd. That is a recursion that halves the problem.
## Key insight
Write `power(base, e)` with the base case `e == 0` returning `1`. Take `half = power(base, e / 2)`, return `half * half % MOD`, and multiply by `base` once more when `e` is odd. The depth is about 60, so the stack is safe, and every product of two values below 1000000007 fits in a `long long`. Use `long long` for the multiplication, never `int`.
