## Signals
A tree given as `TreeNode*`, and a question about the longest root-to-leaf path.

## Brute force
Breadth-first search level by level, counting levels. O(n) time and O(width) space for the queue. It is also a correct solution; it serves as the checker because it shares no logic with the recursion.

## Key insight
The depth of a tree is defined in terms of the depth of its two subtrees: one for the root plus the larger of the two. The empty tree stops the recursion with depth 0.

## Optimal
Recursive depth-first search. Time O(n), visiting each node once. Space O(h) for the call stack, where h is the height: O(log n) for a balanced tree and O(n) for a chain. With at most 10^4 nodes the deepest chain is safe; at 10^6 nodes you would switch to the iterative BFS to avoid a stack overflow.

## C++ walkthrough
`TreeNode*` is a raw pointer; a missing child is `nullptr`, and `root == nullptr` is the idiomatic emptiness test. `max` comes from `<algorithm>` and both arguments must have the same type, here `int`. There is no allocation and no `delete`: the judge builds the tree and owns it.

## Common bugs
Dereferencing before the null check; returning `-1` or `0` for the wrong base case and counting edges instead of nodes; using `min` (shortest path); following only one child; forgetting the `1 +`.

## Follow-ups
Return the minimum depth to the nearest leaf (careful with one-child nodes). Check whether the tree is height-balanced. Do it iteratively with an explicit stack or queue.

## Similar problems
Maximum Depth of Binary Tree (LeetCode 104).
