# Twin Badge

Every visitor to the lighthouse scans a badge with an integer id, and the scans are stored in `badges`. Two scans are **twins** if they carry the same id (they need not be next to each other).

Return `true` if at least one pair of twins exists, otherwise `false`.

## Examples

- `badges = [4, 8, 15, 8]` gives `true`.
- `badges = [1, 2, 3, 4]` gives `false`.
- `badges = []` gives `false`.

## Constraints

- `0 <= badges.size() <= 100000`
- `-1000000000 <= badges[i] <= 1000000000`
