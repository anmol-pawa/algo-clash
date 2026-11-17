class Solution {
public:
    int treeDepth(TreeNode* root) {
        // Wrong: takes the smaller child depth, which finds a short path instead of the longest one (and mishandles a node with one child).
        if (root == nullptr) return 0;
        return 1 + min(treeDepth(root->left), treeDepth(root->right));
    }
};
