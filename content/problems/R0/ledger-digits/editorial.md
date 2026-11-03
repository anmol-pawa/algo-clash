## Signals
"Write this function" on a single number with no data structure: this is plain control flow plus integer arithmetic. The wide constraint (64-bit) is the hint to keep every variable as `long long`.

## Brute force
Convert the number to text with `to_string` and add up the characters that are digits. It is correct and short; it costs O(d) time and O(d) space for `d` digits, and it allocates a string.

## Key insight
`n % 10` gives the last digit and `n / 10` drops it, so a loop over digits needs no string at all. The one trap is the sign: C++ truncates division toward zero and gives `%` the sign of the dividend, so for negative `n` each remainder is negative.

## Optimal
Loop while `n != 0`: take `n % 10`, add its absolute value to the total, then do `n /= 10`. Invariant: `total` holds the digit sum of the digits already removed. At most 19 iterations, so time O(d) and space O(1).

## C++ walkthrough
The parameter is `long long` and is modified in place (it is a copy). Taking the absolute value per digit, not of `n`, avoids the overflow of `-n` at the minimum 64-bit value (the constraint excludes it, but the habit is the point). The result is at most 19 * 9, so `int` is safe.

## Common bugs
Adding signed remainders so negative inputs give negative sums; narrowing `n` to `int` and losing the high digits; looping `while (n > 0)` which returns 0 for every negative input.

## Follow-ups
Repeat until a single digit remains (digital root, and the O(1) formula using mod 9). Count digits instead of summing them. Do it in base 2 and compare with `__builtin_popcountll`.

## Similar problems
Add Digits (LeetCode 258).
