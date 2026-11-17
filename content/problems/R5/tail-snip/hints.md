## Nudge
You cannot see how far from the end a node is until you have reached the end. Can you make a second pointer that already knows when the end arrives?

## Approach
Start two pointers on a dummy node placed before the head. Send the first one `n` nodes ahead. Then move both together until the first one stands on the last node. The second one now stands right before the node to remove, so skip over that node.

## Key insight
Keeping the two pointers `n` nodes apart makes the gap measure "distance from the end" for free, in a single pass. The dummy node means that removing the very first node is the same code path as removing any other.
