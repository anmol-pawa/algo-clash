class Solution {
public:
    int leafSum(TreeNode* root) {
        // Wrong: "either child missing" treated as a leaf.
        if (root == nullptr) return 0;
        if (root->left == nullptr || root->right == nullptr) return root->val;
        return leafSum(root->left) + leafSum(root->right);
    }
};
