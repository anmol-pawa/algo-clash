class Solution {
public:
    int leafSum(TreeNode* root) {
        // Wrong: adds every node, not only leaves.
        if (root == nullptr) return 0;
        return root->val + leafSum(root->left) + leafSum(root->right);
    }
};
