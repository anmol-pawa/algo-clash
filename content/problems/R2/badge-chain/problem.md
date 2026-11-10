# Badge Chain

A guild hands out numbered badges, and a member may hold the same number more than once. A **chain** is a set of badge numbers that are consecutive integers, such as `4, 5, 6, 7`.

Given the list `badges` in any order, return the length of the longest chain you can form using the numbers that appear in the list. A number counts once however many copies exist.

Your solution must run in linear time on average.

## Examples

- `badges = [100, 4, 200, 1, 3, 2]` gives `4` (the chain `1, 2, 3, 4`).
- `badges = [5, 5, 5]` gives `1`.
- `badges = [9, 1, 8, 2, 7]` gives `3` (the chain `7, 8, 9`).

## Constraints

- `0 <= badges.size() <= 100000`
- `-1000000000 <= badges[i] <= 1000000000`
