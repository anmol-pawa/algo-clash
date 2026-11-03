# Crate Order

A dock has `n` crates numbered `0` to `n - 1`. Crate `i` weighs `weights[i]`. The crane must lift them heaviest first. When two crates weigh the same, the one with the smaller number goes first.

Return the crate numbers in lifting order.

A tidy way to write this is a small `struct` that holds a weight and a number, with a constructor and an `operator<` that says which crate comes first, so `sort` can do the rest.

## Examples

- `weights = [5, 9, 5, 1]` gives `[1, 0, 2, 3]`.
- `weights = [3, 3, 3]` gives `[0, 1, 2]`.
- `weights = [7]` gives `[0]`.
- `weights = []` gives `[]`.

## Constraints

- `0 <= weights.size() <= 100000`
- `1 <= weights[i] <= 1000000000`
