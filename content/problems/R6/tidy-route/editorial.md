## Signals
A token that undoes the previous token (`..` after a name) and a separator that needs splitting: tokens processed in order with "undo the most recent" is a stack.

## Brute force
Tokenise, drop empty names and `.`, then repeatedly find the first `..` and erase it together with the name before it (or just itself at the top level). Correct, but each erase shifts the vector and each search rescans from the start: with 25000 names followed by 25000 `..` that is O(n²) token moves and comparisons.

## Key insight
Because tokens are handled left to right, when a `..` appears everything before it has already been tidied. So it only has to cancel the last kept name: the top of a stack.

## Optimal
Scan characters, building the current name until a `/` (a sentinel `/` appended at the end flushes the last name). Empty or `.`: skip. `..`: pop if the stack is not empty. Anything else: push. Rebuild the answer as `/name` for each stack entry, or `/` if empty. Each character is read once and each name is pushed and popped at most once: O(n) time, O(n) space.

## C++ walkthrough
`vector<string>` as the stack, a `string name` accumulator, no `stringstream` needed. Compare with `==` against `".."` and `"."` exactly: a name like `...` or `.a` is ordinary. Build the result with `+=` in one pass rather than `result = "/" + name + result`, which would copy the string repeatedly. Return `"/"` explicitly when the stack is empty.

## Common bugs
Popping from an empty stack (undefined behaviour); keeping `..` as a name at the top level; treating `...` as special; returning `""` for the top level; leaving a trailing slash; not collapsing repeated slashes (empty names pushed).

## Follow-ups
Resolve a *relative* route against a current directory (the stack starts non-empty and `..` at the top is kept). Handle symbolic links with a map and a depth limit to detect loops. Do it in place on the string with two pointers.

## Similar problems
Simplify Path (LeetCode 71) is this problem. Crate Brackets is the same "most recent first" stack skeleton.
