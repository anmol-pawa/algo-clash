## Nudge
Try `lo = hi = 2147483647`. What does `lo + hi` do?

## Approach
You want the average of two numbers without ever forming a value larger than the inputs. Think of walking from `lo` towards `hi`.

## Key insight
`hi - lo` always fits in `int` here (both are non-negative), so `lo + (hi - lo) / 2` is exact, rounds down, and never overflows. This is the line every binary search should use for its midpoint.
