## Signals
An arithmetic expression with `+`, `-` and brackets, where a minus in front of a bracket flips everything inside. There is no precedence to manage (no `*` or `/`), so building a parse tree is overkill: you only need to know the sign in force.

## Brute force
Write a recursive-descent parser: `expr` reads values joined by `+` and `-`, and a value is a number or `(` `expr` `)`. It is correct and O(n), but it recurses once per nesting level, and 50000 nested brackets overflow a typical call stack. A cruder version that finds each bracket's partner by scanning forward is O(n^2): about 2.5 * 10^9 steps on a fully nested slip of length 10^5, far too slow.

## Key insight
Subtraction distributes: `a - (b - c)` is `a - b + c`. So the sign of a number is the product of the signs of every bracket around it and the operator before it. Instead of tracking all of them, keep one `sign` for the next number and, for each open bracket, the pair (total before the bracket, sign in front of it). Closing a bracket merges the group back with one multiplication.

## Optimal
One pass with a stack of saved `(total, sign)` pairs. Scan the slip: a digit run is parsed into a number and added as `sign * value`; `+` sets `sign = 1`; `-` sets `sign = -1`; `(` pushes the current total and sign, then resets total to 0 and sign to 1; `)` pops them and sets `total = outerTotal + outerSign * total`. Spaces are ignored. Each character is looked at once and each bracket is pushed and popped once: O(n) time, O(depth) space, and no recursion.

## C++ walkthrough
Parse numbers by hand into a `long long` (`value = value * 10 + digit`), then do `--i` so the loop's `++i` lands on the first non-digit. Keep `total` and the saved totals in `long long`: a slip of 50000 numbers near 10^9 sums to 5 * 10^13, which overflows `int`. A `-` at the start or just after `(` needs no special handling, because the total is 0 there and the sign applies to the next term.

## Common bugs
Forgetting to multiply by the outer sign when a bracket closes, so `a - (b + c)` becomes `a + b + c`; not resetting `sign` to `+` on `(`, so the first number in the group inherits the sign from outside; parsing one digit at a time; using `int`; and recursing so deeply that the stack overflows.

## Follow-ups
Add `*` and `/` (Basic Calculator II, a stack of pending terms or two running values), then both together with precedence (Basic Calculator III, or a shunting-yard with an operator stack); support variables with an assignment map; report the position of the first mismatched bracket instead of assuming a well-formed slip.

## Similar problems
Basic Calculator (LeetCode 224) is this problem. Evaluate Reverse Polish Notation (LeetCode 150) is the stack-of-values version without brackets, and Decode String (LeetCode 394) uses the same "save the outer context on `(`" trick.
