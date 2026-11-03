class Solution {
public:
    int treeHeight(TreeNode* root) {
        // Wrong: adds both sides, which counts nodes instead of taking the longer path.
        if (root == nullptr) return 0;
        return 1 + treeHeight(root->left) + treeHeight(root->right);
    }
};
