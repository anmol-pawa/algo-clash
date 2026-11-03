## Nudge
A tree is a node plus two smaller trees. If you knew the height of each smaller tree, what would the height of the whole tree be?
## Approach
Write a recursive function. If `root == nullptr` return `0`. Otherwise return `1 + max(height of left, height of right)`.
## Key insight
The base case is the null pointer, not the leaf. Handling `nullptr` once at the top removes every "does this child exist?" check. Counting nodes (not edges) is what makes the empty tree `0` and a single node `1`.
