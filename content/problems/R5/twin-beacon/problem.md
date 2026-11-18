# Twin Beacon

A cave has `n` beacons, numbered `1` to `n`, but the log lists `n + 1` readings, each a beacon number between `1` and `n`. Exactly **one** beacon number appears more than once (it may appear two times, or many times); every other number appears at most once.

Given the array `beacons` of length `n + 1`, return the beacon number that is repeated.

Do it **without changing the array** and with only a constant amount of extra memory. Aim for `O(n)` time.

## Examples

- `beacons = [1,3,4,2,2]` gives `2`.
- `beacons = [3,1,3,4,2]` gives `3`.
- `beacons = [2,2,2,2,2]` gives `2`.
- `beacons = [1,1]` gives `1`.

## Constraints

- `1 <= n <= 100000`, and the array has `n + 1` elements
- `1 <= beacons[i] <= n`
- Exactly one value is repeated; it can occur two or more times
