class Solution {
public:
    int leafSum(TreeNode* root) {
        // Wrong: no nullptr base case, so the first missing child is dereferenced.
        if (root->left == nullptr && root->right == nullptr) return root->val;
        return leafSum(root->left) + leafSum(root->right);
    }
};
