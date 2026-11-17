## Nudge
You cannot ask a linked list for its length without walking it. Can you find the middle while walking only once, with two cursors that move at different speeds?

## Approach
Start `slow` and `fast` at the head. In each step move `slow` by one node and `fast` by two. Stop when `fast` has no node to jump to.

## Key insight
When `fast` has covered the whole list, `slow` has covered exactly half of it. The loop condition `fast != nullptr && fast->next != nullptr` decides which middle you get on an even length (this one gives the second) and keeps the empty list safe.
