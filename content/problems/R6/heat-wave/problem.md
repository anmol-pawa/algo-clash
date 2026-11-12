# Heat Wave

A weather station logs one reading per day. For every day, the crew wants to know how long they must wait for a **strictly hotter** day.

Given the array `temps`, return an array `wait` of the same length where `wait[i]` is the number of days from day `i` to the nearest later day with a higher reading. If no later day is hotter, `wait[i]` is `0`.

## Examples

- `temps = [30, 40, 35, 50, 45]` gives `[1, 2, 1, 0, 0]`.
- `temps = [60, 60, 60]` gives `[0, 0, 0]` (equal is not hotter).
- `temps = [9, 8, 7, 10]` gives `[3, 2, 1, 0]`.

## Constraints

- `0 <= temps.length <= 100000`
- `-1000000000 <= temps[i] <= 1000000000`
