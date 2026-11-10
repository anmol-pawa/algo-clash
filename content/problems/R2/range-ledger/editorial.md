## Signals
Many queries over a static array, each asking for the sum of a contiguous stretch. "Static" is the key word: nothing is updated between questions, so precomputation pays off.

## Brute force
For each query, add up `coins[l..r]`. O(n) per query, O(n * q) overall: 10^10 additions at the limits, which times out.

## Key insight
A range sum is a difference of two running totals: `sum(l..r) = prefix[r + 1] - prefix[l]`. The prefix array turns "add up a stretch" into "subtract two numbers".

## Optimal
Build `prefix` in one pass (`prefix[i + 1] = prefix[i] + coins[i]`), then answer each query in O(1). Time O(n + q), space O(n) for the prefix array (the output is separate). The invariant: `prefix[i]` equals the total of `coins[0..i-1]`, and `prefix[0] = 0` is the empty total.

## C++ walkthrough
Each coin is up to 10^9 in magnitude and there can be 10^5 of them, so totals reach 10^14: both the prefix array and the output must be `long long`. Declaring `prefix` as `vector<int>` compiles and passes small tests, then overflows silently. Iterate queries with `const auto& q` to avoid copying each pair.

## Common bugs
Using a prefix array of length `n` and mishandling `l = 0`; using `prefix[r] - prefix[l]` (drops `coins[r]`); `prefix[r + 1] - prefix[l + 1]` (drops `coins[l]`); an `int` prefix array.

## Follow-ups
What if single values can be updated between queries? (Fenwick tree, later in the game.) How would you answer range sums on a 2-D grid? Count subarrays whose sum equals `k` (that is Exact Stretches).

## Similar problems
Range Sum Query - Immutable (LeetCode 303).
