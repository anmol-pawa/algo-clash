class Solution {
public:
    int treeDepth(TreeNode* root) {
        // Wrong: only ever follows the left child.
        int depth = 0;
        for (TreeNode* p = root; p != nullptr; p = p->left) ++depth;
        return depth;
    }
};
