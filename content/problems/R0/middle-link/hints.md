## Nudge
You cannot jump to index `n / 2` in a linked list. What do you need to know before you can walk there?
## Approach
First pass: count the nodes. Second pass: start at `head` and follow `next` exactly `n / 2` times. Return the node you land on. If `head` is `nullptr` the count is 0 and the answer is `nullptr` too.
## Key insight
Two simple passes are already O(n). (Later you will meet the fast and slow pointer trick that does it in one pass.) The important C++ habit here is to loop on `node != nullptr` and never to follow `next` from a null pointer.
