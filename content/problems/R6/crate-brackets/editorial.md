## Signals
Nesting where the latest opener must close first is last-in-first-out behaviour, so think stack.

## Brute force
Repeatedly delete adjacent matching pairs `()`, `[]`, `{}` until nothing changes. Each pass is O(n) and there can be O(n) passes: O(n^2) time.

## Key insight
Only the most recently opened bracket can legally be closed next, and "most recent" is exactly what a stack stores.

## Optimal
Scan once. Push each opener. For a closer, the stack must be non-empty and its top must be the matching opener; pop it. Invariant: the stack holds the unclosed openers in order of arrival. The label is balanced iff no step fails and the stack ends empty. Time O(n), space O(n).

## C++ walkthrough
`std::string` doubles as the stack (`push_back`, `back`, `pop_back`), so no extra include is needed. Check `empty()` before `back()`: calling `back()` on an empty string is undefined behaviour.

## Common bugs
Not checking for an empty stack before reading the top; returning `true` when openers are left over at the end; counting bracket kinds instead of tracking order, which accepts `([)]`.

## Follow-ups
Return the index of the first bad bracket (store indices). Make it O(1) space for a single bracket kind (a counter is enough). Compute the minimum insertions to balance a label.

## Similar problems
Valid Parentheses (LeetCode 20).
