## Signals
Commands that read or undo "the latest" entries are a stack in disguise: all the action happens at one end, and "cancel" is a pop.

## Brute force
After each command, rebuild the tape from the start (or re-add all scores). It is correct but O(n²): with 100000 commands that is around 5 billion steps.

## Key insight
A command depends only on the newest one or two scores, and `C` only removes the newest. The tape never needs random access, so a stack replaces all recomputation.

## Optimal
Process commands once, mutating a stack. Number: push `stoi`. `+`: push the sum of the top two. `D`: push double the top. `H`: push top / 2. `C`: pop. Finally sum the stack into a `long long`. Time O(n), space O(n).

## C++ walkthrough
Compare commands as whole strings (`cmd == "C"`), and treat anything else as a number: `"-3"` is a score, not a command. Read `tape[n-1]` and `tape[n-2]` **before** pushing, since `push_back` may reallocate and invalidate references. Integer `/ 2` truncates toward zero for negatives, which is what `H` needs; `floor` would be wrong. Scores fit `int` by the constraints, but the total of 100000 of them does not, so accumulate in `long long`.

## Common bugs
Summing into `int`; flooring negative halves; popping the top while computing `+`; treating `"-3"` as an operator; holding a reference to `back()` across a `push_back`.

## Follow-ups
Add a command that duplicates the last *k* scores. Keep a running total so the answer is O(1) at any time (add on push, subtract on pop). Support redo as well as cancel (two stacks).

## Similar problems
Baseball Game (LeetCode 682) is the closest. Evaluate Reverse Polish Notation (LeetCode 150) is Tape Calculator in this region.
