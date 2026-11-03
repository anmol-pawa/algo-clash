## Signals
"Modulo a prime" and an exponent far too big to loop over. Whenever a repeated operation count is up to 10^18, you need to cut the count in half each step, not walk it.

## Brute force
Multiply one bounce at a time, reducing modulo 1000000007 after each step. It is O(bounces), which is fine for the 40-bounce checks and impossible at 10^18.

## Key insight
`base^e = (base^(e/2))^2` when `e` is even and `(base^(e/2))^2 * base` when it is odd (integer division). The exponent halves each call, so the recursion depth is at most 60 for `e <= 10^18`. A recursion that peels one bounce at a time has depth `e` and overflows the call stack almost immediately.

## Optimal
Recursive exponentiation by squaring. Time O(log e), space O(log e) for the call stack.

## C++ walkthrough
The base case is the empty product, `1`. `half * half` is at most (10^9+6)^2, about 10^18, which fits in a `long long` (limit about 9.2 * 10^18) but not in an `int`. The `% MOD` after each multiplication keeps every value small. `base % MOD` before the first call handles a base equal to `MOD - 1` or larger values uniformly. Each recursive call gets its own stack frame holding `half` and `result`; the frames pile up until the base case and unwind in reverse. `static constexpr long long MOD` is a compile-time constant that belongs to the class rather than to any object.

## Common bugs
Forgetting the odd case; multiplying in `int`; recursing on `e - 1` (stack overflow); returning `0` for a zero base with zero bounces; forgetting the final `% MOD`.

## Follow-ups
Write it iteratively with a loop over the bits of `e`. Compute a modular inverse with Fermat's little theorem. Raise a 2x2 matrix to a power to get Fibonacci numbers.

## Similar problems
Pow(x, n) (LeetCode 50).
