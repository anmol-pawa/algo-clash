# Leaf Sum

Given the root of a binary tree, return the sum of the values of its leaves. A leaf is a node with no children at all. A node that has one child is not a leaf. The sum of an empty tree is `0`.

(The node type is the usual `TreeNode` with `val`, `left` and `right`.)

## Examples

- `root = [3,9,20,null,null,15,7]` gives `31` (9 + 15 + 7).
- `root = [1,2]` gives `2` (node 1 has one child, so it is not a leaf).
- `root = [8]` gives `8`.
- `root = []` gives `0`.

## Constraints

- `0 <=` number of nodes `<= 5000`
- `-1000 <= val <= 1000`
