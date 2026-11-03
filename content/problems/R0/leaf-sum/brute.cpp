class Solution {
public:
    int leafSum(TreeNode* root) {
        // Explicit stack instead of recursion.
        if (root == nullptr) return 0;
        int total = 0;
        vector<TreeNode*> stack{root};
        while (!stack.empty()) {
            TreeNode* node = stack.back();
            stack.pop_back();
            if (!node->left && !node->right) total += node->val;
            if (node->left) stack.push_back(node->left);
            if (node->right) stack.push_back(node->right);
        }
        return total;
    }
};
