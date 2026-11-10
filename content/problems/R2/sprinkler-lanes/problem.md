# Sprinkler Lanes

A garden has `lanes` lanes numbered `0` to `lanes - 1`, all starting with water level `0`. A list of `jobs` follows; each job is `[l, r, v]`: every lane from `l` to `r` (both included) receives `v` more units of water. A value `v` may be negative, which drains the lanes.

Return the final water level of every lane, after all jobs have been applied.

## Examples

- `lanes = 5`, `jobs = [[1, 3, 2], [2, 4, 3]]` gives `[0, 2, 5, 5, 3]`.
- `lanes = 3`, `jobs = [[0, 2, 7], [1, 1, -7]]` gives `[7, 0, 7]`.
- `lanes = 4`, `jobs = []` gives `[0, 0, 0, 0]`.

## Constraints

- `1 <= lanes <= 100000`
- `0 <= jobs.size() <= 100000`
- `0 <= l <= r < lanes` and `-1000000000 <= v <= 1000000000` for each job

Final levels can exceed the range of a 32-bit integer. Aim for O(lanes + jobs) time.
