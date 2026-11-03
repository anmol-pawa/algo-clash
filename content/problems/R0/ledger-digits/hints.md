## Nudge
Which two operators peel the last digit off a number and then shorten it?

## Approach
`n % 10` is the last digit and `n / 10` removes it. Repeat until the number is 0. Think about what `%` returns when `n` is negative.

## Key insight
In C++ `%` takes the sign of the dividend, so `-407 % 10` is `-7`. Take the absolute value of each digit (not of `n`, which would overflow for the most negative value). Keep `n` as `long long` the whole way.
