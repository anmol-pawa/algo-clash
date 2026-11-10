# Hot Streak

A trader logs the profit or loss of each day in `gains`. Positive numbers are profit, negative numbers are loss. Pick a run of **consecutive** days (at least one day) so that the total over that run is as large as possible.

Return that largest total. You must pick at least one day, so if every day is a loss the answer is the least bad single day.

## Examples

- `gains = [2, -5, 3, 4, -1, 6, -8]` gives `12` (days 2 to 5: `3 + 4 - 1 + 6`).
- `gains = [-4, -2, -9]` gives `-2`.
- `gains = [5]` gives `5`.

## Constraints

- `1 <= gains.size() <= 100000`
- `-1000000000 <= gains[i] <= 1000000000`

The total can exceed the range of a 32-bit integer. Aim for O(n) time.
