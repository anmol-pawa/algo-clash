# Tree Height

Given the root of a binary tree, return its height: the number of nodes on the longest path that starts at the root and goes down to a leaf. An empty tree has height `0`.

The tree node is the usual one:

```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
```

## Examples

- `root = [3,9,20,null,null,15,7]` gives `3`.
- `root = [1,null,2]` gives `2`.
- `root = [5]` gives `1`.
- `root = []` gives `0`.

## Constraints

- `0 <=` number of nodes `<= 5000`
- `-1000 <= val <= 1000`
