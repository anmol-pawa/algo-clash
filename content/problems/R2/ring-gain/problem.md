# Ring Gain

Stalls stand around a circular plaza, and `gains[i]` is the profit (or loss) of stall `i`. After the last stall comes the first one again. Choose a run of **consecutive** stalls, at least one and at most all of them, that is allowed to wrap from the end of the list back to the start, so that the total is as large as possible. Each stall may be used at most once.

Return that largest total.

## Examples

- `gains = [5, -3, 5]` gives `10` (stall 2, then wrapping to stall 0).
- `gains = [1, -2, 3, -2]` gives `3`.
- `gains = [-3, -2, -3]` gives `-2`.

## Constraints

- `1 <= gains.size() <= 100000`
- `-1000000000 <= gains[i] <= 1000000000`

The total can exceed the range of a 32-bit integer. Aim for O(n) time.
