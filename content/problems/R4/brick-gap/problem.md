# Brick Gap

A wall is built from rows of bricks. Every row has the same total width, and each brick is one unit tall. `rows[i]` lists the widths of the bricks in row `i`, from left to right.

You draw a straight vertical line from the top of the wall to the bottom. The line **crosses** a brick if it passes strictly inside it. Passing exactly along the edge between two bricks crosses nothing. The line must stay strictly inside the wall: running along the far left or far right side is not allowed.

Return the fewest bricks the line can cross.

## Examples

- `rows = [[1,2,2,1],[3,1,2],[1,3,2],[2,4],[3,1,2],[1,3,1,1]]` gives `2`.
- `rows = [[1],[1],[1]]` gives `3` (no interior edge exists, so every row is crossed).
- `rows = [[2,2],[1,3]]` gives `1`.

## Constraints

- `1 <= rows.size() <= 10000`
- `1 <= rows[i].size() <= 10000`, and the total number of bricks is at most `20000`
- `1 <= rows[i][j] <= 1000000000`
- All rows have the same total width, which may exceed the range of a 32-bit `int`.
