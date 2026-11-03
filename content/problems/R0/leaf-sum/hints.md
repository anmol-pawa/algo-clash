## Nudge
How do you recognise a leaf using only the two child pointers?
## Approach
Recurse. If the node is `nullptr`, contribute `0`. If both `left` and `right` are `nullptr`, it is a leaf: return its value. Otherwise return the leaf sum of the left subtree plus that of the right subtree.
## Key insight
The leaf test is `left == nullptr && right == nullptr`: both, not either. A node with exactly one child must pass the recursion down to that child, and the missing child contributes `0` through the null base case.
