# Wrap Dial

A ship's dial has `m` slots numbered `0` to `m - 1` around a ring. Turning the dial moves a pointer by any number of slots, forwards (positive) or backwards (negative), and it wraps around the ring.

The pointer starts at slot `0`. After one turn of `pos` slots, return the slot it lands on, always in the range `0` to `m - 1`.

## Examples

- `pos = 7, m = 5` gives `2`.
- `pos = -1, m = 5` gives `4` (one step back from slot 0 wraps to the last slot).
- `pos = -10, m = 5` gives `0`.

## Constraints

- `-1000000000 <= pos <= 1000000000`
- `1 <= m <= 100000`
