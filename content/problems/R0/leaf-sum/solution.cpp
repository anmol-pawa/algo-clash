class Solution {
public:
    int leafSum(TreeNode* root) {
        if (root == nullptr) return 0;
        if (root->left == nullptr && root->right == nullptr) return root->val;  // a leaf has NO children
        return leafSum(root->left) + leafSum(root->right);
    }
};
