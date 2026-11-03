# Toll Booth

A bridge charges each vehicle per axle. The price per axle depends on the hour of the day the vehicle arrives (`hour` is on a 24-hour clock):

- **Night**, hours `0` to `5` inclusive: 2 coins per axle.
- **Rush**, hours `7` to `9` inclusive and hours `16` to `18` inclusive: 6 coins per axle.
- **Day**, every other hour: 4 coins per axle.

A vehicle with **5 or more axles** also pays a flat heavy-load fee of 10 coins, added once on top of the per-axle price.

Return the total fee in coins.

## Examples

- `hour = 8, axles = 2` gives `12` (rush, 2 x 6).
- `hour = 3, axles = 5` gives `20` (night 5 x 2, plus the heavy-load fee 10).
- `hour = 12, axles = 4` gives `16` (day, 4 x 4, no heavy-load fee).

## Constraints

- `0 <= hour <= 23`
- `1 <= axles <= 8`
