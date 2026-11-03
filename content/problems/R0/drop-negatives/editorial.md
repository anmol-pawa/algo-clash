## Signals
A linked list where the head may be deleted. The dummy-head idiom removes the special case.

## Brute force
Copy the values into a vector, filter it, and rebuild a new list. O(n) time and memory; correct but allocates every node again.

## Key insight
Keep a tail pointer to the end of the kept list, starting at a dummy node that sits before the real head. Every kept node is appended to the tail; skipped nodes are simply never linked. No special case for the head.

## Optimal
One pass, O(n) time, O(1) extra space (the dummy lives on the stack). By interview convention we do not `delete` removed nodes unless asked; mention it aloud.

## C++ walkthrough
`ListNode dummy(0); ListNode* tail = &dummy;` makes a node on the stack. In the loop `ListNode* cur = head; while (cur != nullptr)` we read `cur->next` before relinking, because `tail->next = cur` can change what `cur->next` means later. After the loop `tail->next = nullptr` closes the list. Return `dummy.next`, which is `nullptr` when nothing survived.

## Common bugs
Handling only nodes after the head, so a negative head survives. Forgetting `tail->next = nullptr`, which leaves a dropped node hanging off the end. Dropping zeros as well (`<= 0`). Returning `head` instead of `dummy.next`. Dereferencing `head->next` when `head` is `nullptr`.

## Follow-ups
Remove duplicates from a sorted list. Remove every node equal to a given value. Do it recursively and compare the stack cost.

## Similar problems
Remove Linked List Elements (LeetCode 203).
