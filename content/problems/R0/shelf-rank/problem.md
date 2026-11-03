# Shelf Rank

A library keeps its shelf heights in a list sorted from lowest to highest (equal heights may repeat). Visitors ask many questions of the form: "how many shelves are strictly lower than `h`?"

Given the sorted `shelves` and a list of `queries`, return an array where entry `j` is the number of shelves with height strictly less than `queries[j]`.

## Examples

- `shelves = [1, 3, 3, 8], queries = [3, 9, 0]` gives `[1, 4, 0]`.
- `shelves = [], queries = [5]` gives `[0]`.
- `shelves = [2, 2, 2], queries = [2, 3]` gives `[0, 3]`.

## Constraints

- `0 <= shelves.size() <= 100000`, sorted in non-decreasing order
- `0 <= queries.size() <= 100000`
- `-1000000000 <= shelves[i], queries[j] <= 1000000000`
