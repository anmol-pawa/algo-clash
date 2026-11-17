## Nudge
The only thing a bracket changes is the sign of everything inside it. You never need the structure of the expression, only the sign that is currently in force.

## Approach
Read left to right and keep a running total for the group you are in, plus the sign of the next number. When a `(` arrives, you are about to start a fresh group: what do you need to remember from the outside to continue once it closes?

## Key insight
On `(`, push the outer running total and the sign that sat in front of the bracket, then reset to a total of 0 and a sign of `+`. On `)`, pop both: the new total is `outerTotal + outerSign * groupTotal`. Numbers are added as `sign * value`. A negation at the start or after `(` needs no special case, because the fresh group starts at 0 and the `-` simply sets the sign.
