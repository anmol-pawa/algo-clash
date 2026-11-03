# Echo Chamber

A pulse of strength `1` enters a chamber. Every time it bounces off a wall, its strength is multiplied by `base`. After `bounces` bounces, report the strength **modulo 1000000007**.

With no bounces the strength is still `1`, whatever the base is.

## Examples

- `base = 2, bounces = 10` gives `1024`.
- `base = 3, bounces = 0` gives `1`.
- `base = 2, bounces = 100` gives `976371285` (2^100 modulo 1000000007).

## Constraints

- `0 <= base <= 1000000000`
- `0 <= bounces <= 1000000000000000000`
