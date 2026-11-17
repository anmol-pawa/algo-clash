## Signals
"Reverse a singly linked list in place" asks you to change the direction of every arrow. There is no index access, so any plan has to move along `next` pointers once.

## Brute force
Copy all values into a `vector`, reverse it, and write the values back node by node. It is correct and easy, but it uses O(n) extra space and rewrites values instead of rewiring the list, which is usually not what an interviewer wants.

## Key insight
Each node only needs its arrow flipped once. If you keep the already-flipped prefix as its own list, flipping the next node is "make it point at that prefix, then make it the new prefix head". The only danger is losing the rest of the list when you overwrite `next`, so save it first.

## Optimal
Keep `reversed = nullptr`. While the cursor `head` is not null: `rest = head->next`, `head->next = reversed`, `reversed = head`, `head = rest`. Invariant: `reversed` is the flipped list of every node seen so far, and `head` is the untouched remainder. One pass gives O(n) time and O(1) extra space.

## C++ walkthrough
Use a local variable for the saved node (`rest`) and reuse the parameter `head` as the cursor: parameters are copies of the pointer, so this is safe and shorter. The empty list falls out for free because the loop never runs and `nullptr` is returned. Nothing is allocated, so there is nothing to free.

## Common bugs
Overwriting `head->next` before saving it (the rest of the list is lost); returning the old head instead of `reversed`; forgetting that the old head's `next` must end up `nullptr` (it does, because the first iteration points it at the initial `nullptr`); special-casing the single-node list when the loop already handles it.

## Follow-ups
Reverse only the nodes between positions `left` and `right`; reverse in groups of `k`; solve it recursively and explain the O(n) stack depth; reverse a doubly linked list.

## Similar problems
Reverse Linked List (LeetCode 206) is this problem. Reverse Linked List II (LeetCode 92) and Reverse Nodes in k-Group (LeetCode 25) build on the same three-pointer step.
