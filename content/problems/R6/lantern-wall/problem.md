# Lantern Wall

The night watch of Stackspire hangs lanterns in the windows of a tall wall. The wall is a grid of panes, given as rows of text: `'1'` is a lit pane and `'0'` is a dark one. A rectangle of panes lights the sky only if **every** pane inside it is lit.

Find the largest such rectangle and return how many panes it contains. If no pane is lit, return `0`.

The rectangle must be axis-aligned and made of whole panes, and its panes must be consecutive rows and consecutive columns.

## Examples

- `wall = ["10100", "10111", "11111", "10010"]` gives `6`. Rows 2 and 3, columns 3 to 5, are all lit.
- `wall = ["0"]` gives `0`.
- `wall = ["111", "111"]` gives `6`.
- `wall = ["1011", "1111"]` gives `4`: the right-hand 2 x 2 block, or the whole second row.

## Constraints

- `1 <= wall.size() <= 1000` and every row has the same length `1 <= wall[i].size() <= 1000`.
- `wall.size() * wall[0].size() <= 250000`.
- Every character is `'0'` or `'1'`.
