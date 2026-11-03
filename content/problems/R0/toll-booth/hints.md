## Nudge
Which hours share the same price? Write them as ranges before you write any code.

## Approach
Pick the price per axle with an `if / else if / else` chain, multiply by the axle count, then add the heavy-load fee once if the axle count qualifies.

## Key insight
Every boundary is inclusive: hour 5 is night, hours 7 and 9 are rush, hour 6 is day. Test `hour <= 5` first and the two rush ranges second, so the chain never needs a lower bound for night. The heavy-load fee is flat, so add it after the multiplication, and use `>= 5` for "5 or more".
