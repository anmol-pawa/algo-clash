## Nudge
What is the depth of an empty tree? And if you already knew the depth of the left subtree and of the right subtree, what would the depth of the whole tree be?
## Approach
Recurse. If `root` is `nullptr` return `0`. Otherwise the depth is `1 + max(depth(left), depth(right))`.
## Key insight
The `nullptr` check must come first: dereferencing `root->left` on a null pointer is undefined behaviour. A node with a single child is handled for free because the missing side returns `0` and loses to the `max`.
