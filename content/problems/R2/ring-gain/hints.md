## Nudge
If you already know the best plain stretch (Hot Streak), what extra shape can a circular answer take? Picture the stalls you do **not** use.

## Approach
A wrapping stretch leaves out one contiguous block in the middle of the list. So the best wrapping total is the grand total minus the **smallest** contiguous block. Run Kadane for the maximum and a mirrored Kadane for the minimum, in the same pass.

## Key insight
Answer = `max(maxStretch, total - minStretch)`. One trap: if every value is negative, `minStretch` is the whole array, `total - minStretch = 0` means "use nothing", which is not allowed; in that case return `maxStretch`.
