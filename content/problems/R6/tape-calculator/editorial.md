## Signals
Operators that come *after* their operands, and "combine the most recent two", describe a stack. Anything with nesting or last-in-first-out structure points the same way.

## Brute force
Repeatedly find the first operator, fold it with the two tokens before it, and erase them. Correct, but each fold costs a rescan and an erase from the middle of a vector: O(n²) time. A tape of 50000 additions after 50001 numbers does billions of element moves.

## Key insight
In postfix form, when an operator appears its operands are fully evaluated and are the two newest values. Nothing older can matter yet, so one stack of values replaces the whole rewrite.

## Optimal
Scan the tape once. Numbers are pushed. For an operator, pop `right`, pop `left`, push `left op right`. Invariant: the stack holds the values of the complete sub-expressions read so far. Time O(n); space O(n) in the worst case (all numbers first).

## C++ walkthrough
Detect operators by `size() == 1` and membership in `"+-*/"`, never by the first character, because `"-3"` starts with a minus sign. `stoi` parses negative numbers. C++ integer `/` already truncates toward zero, matching the statement, so no adjustment is needed (Python-style floor division would need one). Pop the right operand first.

## Common bugs
Swapping the operands, which silently breaks `-` and `/` while `+` and `*` still pass; treating `"-3"` as an operator; using floor division; popping without checking, which cannot happen on a valid tape but is worth a comment.

## Follow-ups
Convert an infix expression to postfix (shunting-yard) or evaluate it directly with two stacks, which is Basic Calculator territory. Support unary minus and parentheses. Detect an invalid tape by checking the stack size before every pop.

## Similar problems
Evaluate Reverse Polish Notation (LeetCode 150) is this problem. Basic Calculator II (LeetCode 227) and Basic Calculator (LeetCode 224) build on the same stack.
