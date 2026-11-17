# Tree Depth

A family tree is a binary tree made of `TreeNode`s. Each node has an `int val` and two child pointers, `left` and `right`, which are `nullptr` when the child is missing.

Return the depth of the tree: the number of nodes on the longest path from the root down to a leaf. An empty tree (`root == nullptr`) has depth `0`.

```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
```

The input shows the tree in level order, with `null` for a missing child, for example `[3,9,20,null,null,15,7]`.

## Examples

- `root = [3,9,20,null,null,15,7]` gives `3`.
- `root = [1,null,2]` gives `2`.
- `root = [5]` gives `1`.
- `root = []` gives `0`.

## Constraints

- `0 <= number of nodes <= 10000`
- `-1000000000 <= val <= 1000000000`
