## Nudge
When an operator arrives, which values does it need, and where have you been keeping the values you have not used yet?

## Approach
Push every number onto a stack. On an operator, pop the right operand first and then the left one, combine them, and push the result. The answer is the only value left.

## Key insight
Postfix order guarantees the two operands of an operator are exactly the two newest unused values, so a stack needs no parentheses or precedence rules. Pop order matters: the first pop is the right-hand side.
