## Nudge
Compare two numbers with the same number of digits: which position decides the winner? So which digit is the best one to scratch first?

## Approach
Scan left to right, keeping the digits you have kept in a stack-like string. When a new digit is smaller than the last kept digit and you still have scratches left, pop the last kept digit (scratch it). Then push the new digit. After the scan, if scratches remain, remove them from the end. Finally strip leading zeros and return `"0"` if nothing is left.

## Key insight
Earlier digits matter most, so a digit followed by a smaller digit is always worth removing: the number gets smaller at that position. A monotonic (non-decreasing) stack removes exactly those digits, and any leftover removals come off the largest tail because the kept digits are already non-decreasing.
