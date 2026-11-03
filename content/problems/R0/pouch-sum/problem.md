# Pouch Sum

A traveller carries a pouch of coins. Coin `i` is worth `coins[i]`. The toll keeper only accepts coins worth at least `minValue`; all smaller coins are refused. Return the total value of the accepted coins.

## Examples

- `coins = [5, 1, 7, 3], minValue = 4` gives `12` (the 5 and the 7).
- `coins = [2000000000, 2000000000], minValue = 1` gives `4000000000`.
- `coins = [1, 2, 3], minValue = 10` gives `0`.

## Constraints

- `0 <= coins.size() <= 100000`
- `0 <= coins[i] <= 2000000000`
- `0 <= minValue <= 2000000000`
