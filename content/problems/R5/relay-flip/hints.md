## Nudge
Reversing one whole list is a loop you already know. What do you need to remember so that a reversed block can be plugged back between its neighbours?

## Approach
Use a dummy node before the head. Keep `groupPrev`, the node just before the current block. Walk `k` steps from it to find the block's last node; if you run out of nodes, stop and leave the rest alone. Otherwise reverse exactly those `k` nodes and reconnect both ends.

## Key insight
Before reversing, save `groupNext`, the node after the block, and start the reversal with `prev = groupNext` instead of `nullptr`. Then the old first node of the block ends up already pointing at the rest of the list. After the loop the old first node is the new `groupPrev`, and the block's old last node is now the front you link from the previous block.
