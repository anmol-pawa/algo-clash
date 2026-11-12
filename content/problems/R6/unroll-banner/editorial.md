## Signals
Brackets nested to any depth, with a repeat count in front. The innermost group resolves first, and while you are inside it you must remember the outer text and count: that is a stack of frames.

## Brute force
Find the first `]`, walk back to its `[` (this is always an innermost group), read the count before it, replace the whole `k[body]` with `body` repeated `k` times, and rescan from the start. Correct, but every replacement rebuilds the whole string: with 25000 tiny groups that is 25000 rebuilds of a string tens of thousands of characters long, O(groups · length), quadratic in the worst case.

## Key insight
Process the banner once, left to right, writing into a single output string. An open bracket only needs to remember where its body starts in the output and its repeat count. When the bracket closes, the body is the tail of the output from that start, and it already appears once, so append `count - 1` more copies.

## Optimal
State: `out`, `count` (digits seen since the last bracket) and a stack of `(start, count)`. Digit: `count = count * 10 + d`. `[`: push `(out.size(), count)` and reset `count`. `]`: pop `(start, times)`, copy `body = out.substr(start)`, append it `times - 1` times (or cut `out` back to `start` if `times` is 0). Letter: append. Every character written is part of the final banner at least once more often than it was written, so the total work is O(n + L) time and O(n + L) space, where n is the input length and L the output length.

## C++ walkthrough
`vector<pair<size_t, int>>` is the stack; storing an index instead of a saved string means entering a bracket copies nothing, and a group with count 1 costs only the body copy. Convert digits with `isdigit` on an `unsigned char` and accumulate in an `int` (counts are at most 300). Reset `count` after `[`, otherwise the next group inherits it. Take `body` as a copy before appending (and only when the count is above 1, so a count of 1 costs nothing): appending a string to itself is a bug waiting to happen.

## Common bugs
Reading only one digit of the count; not saving the outer text (the result loses everything before the first bracket); repeating the text before the bracket together with the body; forgetting to reset the count; using recursion without care for 50000-deep nesting (stack overflow), which is a good reason to prefer the explicit stack.

## Follow-ups
Do it with recursive descent and discuss the depth limit. Return the length of the unrolled banner without building it (then the stack holds lengths and a count, and the limit on output length no longer matters, but use `long long`). Support a letter with no count meaning once, as it does here, plus uppercase letters.

## Similar problems
Decode String (LeetCode 394) is this problem. Crate Brackets (balanced brackets) is the matching skeleton; Tape Calculator is the same "save state when you dive in" idea for expressions.
