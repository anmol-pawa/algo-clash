## Signals
"Add up only the values that qualify" is a filtered accumulation: one pass, one running total, one condition. The words "total" and "value up to 2 * 10^9" point at the accumulator's range.

## Brute force
There is nothing asymptotically slower to compare with; every solution reads each coin once. The reference check uses an index loop with a 128-bit accumulator, so it cannot overflow and proves the 64-bit answer is exact.

## Key insight
The answer is at most 10^5 * 2 * 10^9 = 2 * 10^14. That fits in 64 bits but not in 32, so the accumulator must be `long long`. The filter is "at least", so the comparison is `>=`.

## Optimal
One pass: if the coin passes the filter, add it. Time O(n), space O(1) beyond the input.

## C++ walkthrough
`for (const auto& coin : coins)` reads each element without copying or modifying it. `total += coin` promotes the `int` to `long long` before adding. The pattern is the same shape as every accumulate-with-condition loop: initialise the accumulator with its final type, loop, test, update.

## Common bugs
`int total`; `>` instead of `>=`; stopping at `size() - 1`; filtering with the wrong direction (`<=`).

## Follow-ups
Count the accepted coins as well. Return the sum modulo 10^9 + 7. Do it for several `minValue` queries at once after sorting and building prefix sums.

## Similar problems
Sum of All Odd Length Subarrays (LeetCode 1588) is a related accumulation exercise.
