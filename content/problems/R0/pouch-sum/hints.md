## Nudge
Which coins end up in the total, and how big can that total get?

## Approach
Walk the coins once. For each coin, test it against `minValue`, and only then add it to one running total. Decide that total's type before writing the loop.

## Key insight
`coin >= minValue` is the filter ("at least"), and the total can reach 2 * 10^14, so it must be `long long`. Adding an `int` coin to a `long long` total widens the coin first, which is exactly what you want.
