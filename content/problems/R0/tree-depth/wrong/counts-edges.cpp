class Solution {
public:
    int treeDepth(TreeNode* root) {
        // Wrong: the empty tree returns -1, so every count is one too small (this measures edges, not nodes).
        if (root == nullptr) return -1;
        return 1 + max(treeDepth(root->left), treeDepth(root->right));
    }
};
