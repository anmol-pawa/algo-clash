## Signals
An infix expression with precedence, brackets and a sign that depends on context. "Resolve the innermost group first" plus "remember what was pending outside" is the stack signal. The sign is the twist that separates this from the easy calculator: `-` means subtraction after an operand and negation where an operand is expected.

## Brute force
Repeatedly find the first `)`, walk back to its matching `(`, evaluate that bracket-free slice, and splice the number back into the string. Correct, but each splice rebuilds a string of length n and each scan restarts from the front, so n/2 nested brackets cost O(n^2): about 5 * 10^9 character steps for n = 200000. A recursive-descent parser is O(n) but its recursion depth equals the bracket depth, which can reach 100000 and overflow the call stack.

## Key insight
Precedence is a comparison, not a grammar. Keep an operator stack, and before pushing an operator `op`, apply everything on top whose strength is **greater than or equal to** `op`'s. That single rule gives left-to-right grouping for equal strengths and correct precedence between `+ -` and `* /`. A bracket is an operator of strength 0 that nothing can pop except its own `)`. The sign is an operator `neg` of strength 3 with one operand: it is pushed with no popping, and a later binary operator pops it first.

Whether a `-` is a sign is decided by one flag, `expectOperand`: true at the start, after `(` and after any operator, false after a number or `)`. Truncating division needs no help: C++ integer `/` already rounds toward zero, and `-(a / b)` equals `(-a) / b` under truncation, so the sign's strength never changes an answer.

## Optimal
One pass over the characters, a stack of values and a stack of operators. Each number is pushed once and each operator pushed and applied once, so the whole scan is O(n) time and O(n) space, with no recursion, so depth is limited only by memory. Apply `neg` by flipping the top value; apply a binary operator by popping `b` then `a` (the order matters for `-` and `/`) and pushing `a op b`.

## C++ walkthrough
Hold values in `vector<long long>` so a 32-bit intermediate never overflows while it is being combined (the statement guarantees the result fits, but `INT_MIN`-adjacent literals still make `int` arithmetic fragile). Parse multi-digit numbers with an inner `while (isdigit(...))` loop and advance `i` past them. Skip spaces first in every iteration. At the end of the string, apply the remaining operators. The answer is the single value left.

## Common bugs
Popping with `>` instead of `>=`, which makes `8 - 3 - 2` equal `7`; treating every `-` as binary so `(-3)` or `2 * -3` crashes or reads garbage; inserting a fake `0` before a `-` only at the start and after `(`, which turns `2 * -3` into `2 * 0 - 3`; flooring division (`floor`, or `>>` on negatives) when the statement says truncate; giving `*` and `/` the same strength as `+` and `-`; popping an operator past its `(`.

## Follow-ups
Add exponentiation (right-associative, stronger than `*`); support variables with a lookup map; return the expression tree instead of a number; do the same without a stack by recursive descent and discuss the depth risk; detect an invalid expression and say where it breaks.

## Similar problems
Basic Calculator II (LeetCode 227) is this without brackets or signs. Basic Calculator III (LeetCode 772) is this with `+ - * /` and brackets but no sign operator; the original Basic Calculator (LeetCode 224) has only `+ - ( )`. Evaluate Reverse Polish Notation (LeetCode 150) is the post-fix target the two-stack method implicitly builds.
