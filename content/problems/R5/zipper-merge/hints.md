## Nudge
Only the two front nodes can be the next node of the answer. How do you pick between them, and what do you do with the one you did not pick?

## Approach
Keep a `tail` pointer to the last node of the merged list. Compare the two front nodes, link the smaller one after `tail`, advance that list and `tail`. Start `tail` on a dummy node so the very first link needs no special case.

## Key insight
When one list runs out, the other is already sorted and every node in it is at least as large as everything merged so far, so attach the remainder in one assignment. Return `dummy.next`. You never copy a value or allocate a node.
