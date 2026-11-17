## Nudge
Draw the list as boxes and arrows. After flipping the first node's arrow, how will you still find the second node?

## Approach
Walk the list with a cursor and keep a pointer `reversed` to the part you have already flipped (start it at `nullptr`). For each node: remember its old `next`, point it at `reversed`, move `reversed` to it, and advance the cursor to the remembered node.

## Key insight
Three pointers are enough: the node being flipped, the flipped prefix, and the saved rest. Saving the old `next` before overwriting it is the whole trick. When the cursor falls off the end, `reversed` is the new head.
