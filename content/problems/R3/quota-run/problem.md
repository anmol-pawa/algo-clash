# Quota Run

A trader logs the change in coins at the end of each day: `change[i]` is positive for a good day and negative for a bad one. The trader wants to know how quickly a **run of consecutive days** can add up to the quota.

Return the length of the **shortest** non-empty run of consecutive days whose changes sum to **at least** `quota`. If no run reaches the quota, return `-1`.

## Examples

- `change = [2, -1, 2]`, `quota = 3` gives `3` (only the whole row reaches 3).
- `change = [5]`, `quota = 5` gives `1`.
- `change = [1, 2]`, `quota = 4` gives `-1`.
- `change = [84, -37, 32, 40, 95]`, `quota = 167` gives `3` (`32 + 40 + 95 = 167`, and no run of two days reaches 167).

## Constraints

- `1 <= change.size() <= 100000`
- `-100000 <= change[i] <= 100000`
- `1 <= quota <= 10000000000`
- Sums of a run can exceed the range of a 32-bit integer.
