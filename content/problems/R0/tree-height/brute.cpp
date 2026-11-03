class Solution {
public:
    int treeHeight(TreeNode* root) {
        // Level-order: count how many levels the queue goes through.
        if (root == nullptr) return 0;
        queue<TreeNode*> level;
        level.push(root);
        int levels = 0;
        while (!level.empty()) {
            ++levels;
            for (size_t i = level.size(); i > 0; --i) {
                TreeNode* node = level.front();
                level.pop();
                if (node->left) level.push(node->left);
                if (node->right) level.push(node->right);
            }
        }
        return levels;
    }
};
