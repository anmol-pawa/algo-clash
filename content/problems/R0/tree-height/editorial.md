## Signals
A tree question answered from the answers of its two subtrees: recursion with `nullptr` as the base case.

## Brute force
Level-order traversal with a queue, counting levels. O(n) time and O(width) memory. It is the checker.

## Key insight
`height(node) = 1 + max(height(left), height(right))` with `height(nullptr) = 0`. The recursion mirrors the shape of the data.

## Optimal
Visits each node once: O(n) time. Space is the recursion depth: O(h), at worst O(n) for a skewed tree, which is why the limit is 5000.

## C++ walkthrough
`max` comes from `<algorithm>` (already included). `root->left` and `root->right` are `TreeNode*`, which may be `nullptr`; the recursive call accepts them because the first line checks for it. The function takes the pointer by value: only the pointer is copied, not the tree.

## Common bugs
Returning `-1` or `0` for the wrong base (counting edges instead of nodes). Following only the left child. Forgetting the null check and crashing on an empty tree or on any node with one child. Adding the heights of both sides instead of taking the larger.

## Follow-ups
Do it iteratively with a queue. Return the minimum depth. Check whether the tree is balanced by comparing the heights of both sides at every node.

## Similar problems
Maximum Depth of Binary Tree (LeetCode 104).
