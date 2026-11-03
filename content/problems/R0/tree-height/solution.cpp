class Solution {
public:
    int treeHeight(TreeNode* root) {
        if (root == nullptr) return 0;  // an empty tree has no nodes on any path
        return 1 + max(treeHeight(root->left), treeHeight(root->right));
    }
};
