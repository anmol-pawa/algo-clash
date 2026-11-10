# Flip Budget

A corridor has a row of lamps. `lamps[i]` is `1` if lamp `i` is on and `0` if it is off. A technician can switch **at most `budget` lamps from off to on** (lamps that are already on stay on).

After the flips, what is the length of the longest run of consecutive lamps that are all on? Return that best possible length.

## Examples

- `lamps = [1, 1, 0, 0, 1, 1, 1, 0, 1]`, `budget = 2` gives `7` (flip the two zeros at positions 2 and 3, or at 3 and 7; the first choice gives the run from position 0 to 6).
- `lamps = [0, 0, 0]`, `budget = 0` gives `0`.
- `lamps = [1, 0, 1]`, `budget = 1` gives `3`.

## Constraints

- `0 <= lamps.size() <= 100000`
- `lamps[i]` is `0` or `1`.
- `0 <= budget <= 100000`
