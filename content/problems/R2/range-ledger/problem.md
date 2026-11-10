# Range Ledger

A harbour clerk records the coin value of each crate along a quay: `coins[i]` is the value of crate `i`. Auditors then ask many questions of the form "what is the total value of the crates from position `l` to position `r`, both ends included?"

Given `coins` and a list of `queries`, where each query is a pair `[l, r]`, return the answers in order as a list of totals.

## Examples

- `coins = [3, -1, 4, 1, 5]`, `queries = [[0, 4], [1, 2], [3, 3]]` gives `[12, 3, 1]`.
- `coins = [7]`, `queries = [[0, 0]]` gives `[7]`.
- `coins = [2, 2, 2]`, `queries = []` gives `[]`.

## Constraints

- `1 <= coins.size() <= 100000`
- `-1000000000 <= coins[i] <= 1000000000`
- `0 <= queries.size() <= 100000`
- `0 <= l <= r < coins.size()` for every query

A single total can exceed the range of a 32-bit integer. Aim for O(n + q) time overall.
