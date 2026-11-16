## Nudge
Without brackets you could keep a running total plus "the term I am still multiplying". Brackets break that, because a whole sub-line must finish before the outside continues. What data structure remembers "what I was doing when I stepped inside"?

## Approach
Scan left to right with two stacks: one of numbers, one of operators. A number goes straight on the number stack. When a new operator arrives, first apply every operator already on top of the operator stack that is at least as strong, then push the new one. `(` is pushed and acts as a wall; `)` applies operators back to that wall and removes it. A `-` that arrives where an operand was expected is a sign, not a subtraction.

## Key insight
Give the sign its own operator, stronger than `*`, and push it without popping anything (it has no left operand). Equal-strength operators must pop with `>=`, not `>`, or `8 - 3 - 2` turns right-associative. Truncating division is what C++ `/` already does, so do not "fix" it.
