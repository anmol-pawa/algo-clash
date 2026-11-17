class Solution {
public:
    int treeDepth(TreeNode* root) {
        if (root == nullptr) return 0;  // base case: an empty tree has no nodes on any path
        return 1 + max(treeDepth(root->left), treeDepth(root->right));
    }
};
