## Nudge
Grade-school addition works from the ones place upwards, and the chains already start there. What do you carry from one column to the next, and when are you really done?

## Approach
Walk both chains together, adding the two current digits plus the carry. Append `sum % 10` as a new node and keep `sum / 10` as the next carry. When one chain is shorter, treat its missing digits as 0. Start the output on a dummy node so the first digit needs no special case.

## Key insight
The loop condition is "either chain has digits **or** a carry is left", which handles different lengths and the extra leading digit in `999 + 1` with no extra code after the loop. Never convert the chains to integers: they can have 100000 digits.
