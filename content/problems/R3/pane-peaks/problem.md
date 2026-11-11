# Pane Peaks

A greenhouse roof is a row of glass panes. `heat[i]` is the temperature reading of pane `i` (it can be negative on frosty days). A cleaning frame covers exactly `width` neighbouring panes and starts over the first `width` panes. It then slides one pane to the right at a time until it reaches the last pane.

For every position of the frame, record the **hottest** reading among the panes it covers. Return all these readings in order, from the leftmost frame position to the rightmost.

## Examples

- `heat = [2, 7, 1, 5, 3]`, `width = 3` gives `[7, 7, 5]`.
- `heat = [4, 4, 4]`, `width = 2` gives `[4, 4]`.
- `heat = [-3, -8, -1]`, `width = 1` gives `[-3, -8, -1]`.
- `heat = [9, 1, 2]`, `width = 3` gives `[9]`.

## Constraints

- `1 <= heat.size() <= 100000`
- `1 <= width <= heat.size()`
- `-1000000000 <= heat[i] <= 1000000000`
