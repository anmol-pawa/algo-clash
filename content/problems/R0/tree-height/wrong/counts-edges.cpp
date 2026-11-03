class Solution {
public:
    int treeHeight(TreeNode* root) {
        // Wrong: base case -1 counts edges, so every height is one too small.
        if (root == nullptr) return -1;
        return 1 + max(treeHeight(root->left), treeHeight(root->right));
    }
};
