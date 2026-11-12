## Signals
"A stack, plus one more question answered in O(1)" means the extra answer must survive pops. Whenever a structure only changes at one end, you can store a running summary with each element.

## Brute force
Keep a plain vector and scan it inside `low()`. Correct, but 200000 operations with a tall stack cost about n² / 2 element visits, which is billions: O(n) per `low` call, O(n) space.

## Key insight
`low()` is a function of the whole stack content, and the content below an element never changes while that element is on the stack. So each element can carry "lowest reading from the bottom up to me". Popping an element removes its summary with it and exposes the previous, still-correct, one.

## Optimal
Store `(val, lowestSoFar)` per item, where `lowestSoFar = min(val, lowestSoFar of the item below)`. All four operations are O(1) time; space is O(n), two ints per item. Alternative: a second stack of minimums that pushes on every push (not only on new minimums), which is the same idea split across two vectors.

## C++ walkthrough
`vector<pair<int,int>>` with `emplace_back` is a clean stack, and `back()` gives the top. Methods that do not modify state are `const`. The first push has no item below, so the lowest is the value itself. Do not `pop_back` on an empty vector: the statement promises it never happens, but it is worth a comment in a real codebase.

## Common bugs
Keeping one `min` variable and never repairing it after a pop; a side stack that pushes only when `val < currentMin`, so two equal minimums lose one on the first pop (use `<=` or push every time); recomputing with a scan.

## Follow-ups
Return the lowest **and** highest. Support `popMin`-style removal (needs a different structure, such as a balanced tree or lazy deletion). Reach O(1) extra space for the minimum by storing differences from the running minimum. Add `low()` for a queue (two stacks, each tracking its own minimum).

## Similar problems
Min Stack (LeetCode 155) is this problem. Max Stack (LeetCode 716) adds `popMax`. Sliding Window Maximum (LeetCode 239) keeps a monotonic deque for the same "summary that survives removal" job.
