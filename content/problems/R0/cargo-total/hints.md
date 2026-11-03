## Nudge
What is the biggest value an `int` can hold, and how big can this total get?

## Approach
Add every crate into one running total. Decide the type of that total before you write the loop.

## Key insight
100000 crates of up to 2 * 10^9 sum to 2 * 10^14, far beyond `int`. Make the accumulator `long long`. If you use `std::accumulate`, the start value must be `0LL`, because the start value's type decides the type of the sum.
