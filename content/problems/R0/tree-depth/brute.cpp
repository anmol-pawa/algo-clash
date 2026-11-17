class Solution {
public:
    int treeDepth(TreeNode* root) {
        // Level-by-level breadth-first walk; the number of levels is the depth. Checker only.
        if (root == nullptr) return 0;
        queue<TreeNode*> q;
        q.push(root);
        int levels = 0;
        while (!q.empty()) {
            ++levels;
            for (size_t k = q.size(); k > 0; --k) {
                TreeNode* node = q.front();
                q.pop();
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        return levels;
    }
};
