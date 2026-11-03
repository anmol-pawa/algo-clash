# Rank Roster

A tournament keeps a roster of players. Each entry is `[id, score]`. Return the ids in ranking order: the higher score ranks first, and players with equal scores are ordered by the smaller id first. All ids are different.

Write a small `struct Player` with a constructor and an `operator<` so that `sort` can do the work.

## Examples

- `players = [[7,50],[3,90],[5,50]]` gives `[3,5,7]`.
- `players = [[1,10],[2,10],[0,10]]` gives `[0,1,2]`.
- `players = [[4,-5]]` gives `[4]`.
- `players = []` gives `[]`.

## Constraints

- `0 <= players.size() <= 100000`
- `0 <= id <= 1000000000`, and every id is different
- `-1000000000 <= score <= 1000000000`
