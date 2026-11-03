## Signals
"Average of two ints" with bounds that touch `INT_MAX` is the classic 32-bit overflow trap. The same bug sat in widely used library binary searches for years.

## Brute force
Widen both values to `long long` first, add, divide by two and narrow back. It is correct, just heavier than needed; it is used as the reference check here.

## Key insight
The sum `lo + hi` can be as large as 2^32 - 2, which does not fit in a signed 32-bit integer. The difference `hi - lo` does fit, so move from `lo` by half of the gap.

## Optimal
Return `lo + (hi - lo) / 2`. Integer division truncates toward zero and the gap is non-negative, so this equals the floor of the true midpoint. Time O(1), space O(1).

## C++ walkthrough
Signed integer overflow is undefined behaviour in C++, so `(lo + hi) / 2` is not merely "wraps to a negative number": the compiler may assume it cannot happen. `lo + (hi - lo) / 2` stays in range at every step. `(lo + hi) >> 1` has the same overflow problem; `std::midpoint` (C++20, `<numeric>`) is the library answer.

## Common bugs
Writing `(lo + hi) / 2`; rounding the other way with `hi - (hi - lo) / 2`; assuming the bug needs huge arrays (a handful of values near 2^31 is enough).

## Follow-ups
Allow negative positions (then `hi - lo` can overflow too, so use `long long` or `std::midpoint`). Return the ceiling midpoint. Use the safe midpoint inside a binary search for the first true.

## Similar problems
Binary Search (LeetCode 704) uses exactly this midpoint line.
