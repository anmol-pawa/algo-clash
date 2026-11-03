## Nudge
What if the very first node has to go? Then the answer's head is a different node from the input's head.
## Approach
Walk with a pointer to the last kept node. Create a throwaway `ListNode dummy(0)` placed before the real head, so that "the last kept node" always exists, even before you keep anything. For each node, if it is not negative, link it after the last kept node. Finish by setting the last kept node's `next` to `nullptr` and returning `dummy.next`.
## Key insight
A dummy head turns "remove the head" into the same case as "remove any other node". Always terminate the kept chain with `nullptr`; otherwise the last kept node may still point at a node you meant to drop.
