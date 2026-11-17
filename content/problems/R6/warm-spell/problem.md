# Warm Spell

A weather station records one temperature per day. `forecast[i]` is the temperature on day `i`.

For every day, work out how many days you must wait until a **strictly warmer** day arrives. If no later day is warmer, the wait is `0`.

Return an array `wait` of the same length where `wait[i]` is that number of days for day `i`.

## Examples

- `forecast = [20, 18, 25, 19, 21, 17]` gives `[2, 1, 0, 1, 0, 0]`.
- `forecast = [5, 5, 5]` gives `[0, 0, 0]` (equal is not warmer).
- `forecast = [1, 2, 3, 4]` gives `[1, 1, 1, 0]`.

## Constraints

- `0 <= forecast.size() <= 100000`
- `-1000000000 <= forecast[i] <= 1000000000`
