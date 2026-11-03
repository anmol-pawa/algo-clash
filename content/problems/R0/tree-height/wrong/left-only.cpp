class Solution {
public:
    int treeHeight(TreeNode* root) {
        // Wrong: only follows left children.
        if (root == nullptr) return 0;
        return 1 + treeHeight(root->left);
    }
};
