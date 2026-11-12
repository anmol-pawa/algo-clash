# Valley Tally

A surveyor walked a trail and wrote down the `depths` of the ground at each step. For every **contiguous stretch** of the trail (one or more steps in a row), she noted its **lowest** depth. Her assistant must add up those lowest depths over *every* stretch.

Return the total modulo `1000000007`.

## Examples

- `depths = [3, 1, 2, 4]` gives `17`. The ten stretches have lows `3, 1, 2, 4, 1, 1, 2, 1, 1, 1`.
- `depths = [5]` gives `5`.
- `depths = [2, 2]` gives `6`: the stretches `[2]`, `[2]` and `[2, 2]` each have low `2`.
- `depths = []` gives `0`.

## Constraints

- `0 <= depths.size() <= 100000`
- `1 <= depths[i] <= 1000000000`
- Stretches are counted by position, so equal stretches at different places count separately.
