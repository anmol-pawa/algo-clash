## Signals
A statement that adds many values with large entries and a "total" in the question is a flag to check the accumulator's range before writing any code. Two numbers decide it: the largest item and the item count.

## Brute force
There is no slower approach to compare with: every solution must look at each crate once. The reference check here uses a 128-bit accumulator so it cannot overflow, which proves the 64-bit answer is exact.

## Key insight
The answer is at most 10^5 * 2 * 10^9 = 2 * 10^14. That fits in a 64-bit integer (about 9.2 * 10^18) but not in 32 bits (about 2.1 * 10^9), so the type of the running total is the whole problem.

## Optimal
One pass with a `long long total` that starts at 0. Time O(n), space O(1).

## C++ walkthrough
`for (const int x : w)` reads each element without writing to the vector. `total += x` promotes `x` to `long long` before adding. `std::accumulate(w.begin(), w.end(), 0LL)` is the one-liner; with plain `0` the sum is computed in `int` and the overflow is silent (signed overflow is undefined behaviour). Taking `vector<int> w` by value copies it; interview solutions normally take `const vector<int>&`, and the harness accepts either.

## Common bugs
Declaring `int total`; calling `accumulate` with `0` instead of `0LL`; widening only at the `return`, which is too late; reading only up to `size() - 1`.

## Follow-ups
Return the average as a `double` without losing precision. Return the total modulo 10^9 + 7. Find the largest prefix whose sum stays below a limit.

## Similar problems
Running Sum of 1d Array (LeetCode 1480).
