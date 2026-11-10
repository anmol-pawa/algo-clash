# Ferry Pairs

A ferry carries **at most two riders** at a time, and the combined weight of its riders must not exceed `limit`. Every rider weighs at most `limit`, so each can always ride alone.

Given the rider `weights`, return the fewest ferry trips needed to carry everyone once.

## Examples

- `weights = [1, 2], limit = 3` gives `1`.
- `weights = [3, 2, 2, 1], limit = 3` gives `3` (pairs `1 + 2`, then `2` alone, then `3` alone).
- `weights = [3, 5, 3, 4], limit = 5` gives `4`.

## Constraints

- `0 <= weights.size() <= 100000`
- `1 <= weights[i] <= limit <= 1000000000`

Aim for O(n log n).
