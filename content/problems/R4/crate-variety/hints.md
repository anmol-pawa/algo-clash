## Nudge
If a stretch has too many kinds, what does shrinking it from the left do to the count of kinds? Does a shorter stretch ever make things worse?

## Approach
Grow the right end one crate at a time, counting each kind in a hash map. While the map holds more than `k` kinds, drop crates from the left end until it does not. Record the window length after each step.

## Key insight
Removing crates only ever lowers the number of kinds, so the window condition is monotone and two pointers suffice. When a count reaches zero you must erase the key, because the number of kinds is the map's size.
