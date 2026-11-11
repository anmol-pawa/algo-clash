## Nudge
Try the usual window: grow on the right, shrink on the left while the sum is big enough. Where does it break when `change` has negative numbers? Then rewrite "sum of days i..j" using prefix sums.

## Approach
Let `prefix[k]` be the sum of the first `k` days. A run from start `s` to end `e` has sum `prefix[e] - prefix[s]`. Sweep `e` from 0 to `n` and keep a deque of candidate starts whose prefix values increase. While the front start makes the sum reach the quota, record `e - start` and pop it. Before pushing `e`, pop starts from the back whose prefix is not smaller than `prefix[e]`.

## Key insight
Two facts justify throwing candidates away. A start that already reached the quota is never useful again, because every later end is farther away. A start with a prefix at least as big as a newer start's prefix is older (longer runs) and gives smaller sums, so the newer one always beats it. What remains is a deque with increasing prefix values: a monotonic deque again. Use `long long` for prefix sums: they reach 10^10.
