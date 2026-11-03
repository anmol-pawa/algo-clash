## Signals
A property of the leaves only. Spot the leaf by its two null children and let recursion handle the rest.

## Brute force
Traverse with an explicit stack, add `val` whenever a popped node has no children. O(n) time, O(h) space.

## Key insight
Three cases are enough: null gives 0, a leaf gives its value, anything else gives the sum over its children. Because the null case already returns 0, you never need to check whether a single child exists.

## Optimal
Each node is visited once: O(n) time; recursion depth O(h), at worst O(n) = 5000 here.

## C++ walkthrough
`root->left == nullptr && root->right == nullptr` is the leaf test. The sum fits in `int`: 5000 values of at most 1000 in magnitude. The first line `if (root == nullptr) return 0;` protects every dereference that follows it.

## Common bugs
Adding every node's value (that is a total, not a leaf sum). Using `||` so a node with one child counts as a leaf. Skipping the null check and crashing on the empty tree or on one-child nodes. Treating the root as a leaf when it has children.

## Follow-ups
Sum only the left leaves. Return the leaves in order as a vector. Count the leaves instead of summing them.

## Similar problems
Sum of Left Leaves (LeetCode 404).
