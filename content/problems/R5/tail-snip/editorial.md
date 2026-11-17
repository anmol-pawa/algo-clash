## Signals
"The k-th node from the end" in a **singly** linked list: you cannot walk backwards and you do not know the length. A fixed gap between two runners turns "distance from the end" into "distance between two pointers".

## Brute force
Copy the values into a `vector`, erase the right index, and rebuild a list. It works, but it allocates O(n) extra memory and throws away the nodes you were given. The classic two-pass fix is to count the length `L` first, then walk `L - n` steps to the predecessor. That is O(n) time and O(1) space, just two traversals.

## Key insight
Put one runner `n` nodes ahead of the other. When the front runner reaches the last node, the back runner is exactly `n - 1` nodes from the end, which makes it the **predecessor** of the target. One pass, no length needed.

## Optimal
Build `anchor(0, head)` on the stack. Advance `lead` from `anchor` by `n` steps. Start `trail` at `anchor`. While `lead->next` is non-null, advance both. Then `doomed = trail->next; trail->next = doomed->next; delete doomed;`. Return `anchor.next`. Time O(n) with a single traversal, space O(1).

## C++ walkthrough
Starting both runners on the dummy means the predecessor of the first node is always a real node, so removing the head needs no branch. The constraint `1 <= n <= length` guarantees `lead` never falls off the list during the first loop; in an interview, say that out loud and ask what to do when `n` is larger. `delete` the cut node if the list owns its nodes; if the caller owns them, just unlink.

## Common bugs
No dummy node, so removing the first node dereferences null; a gap of `n + 1` (or `n - 1`) that removes the neighbour; counting from the front instead of the end; returning `head` instead of `anchor.next` (wrong when the head was removed); a per-node recount that makes the whole thing O(n^2).

## Follow-ups
Return the removed value too; handle `n` larger than the length gracefully; remove the middle node (the gap is half); do it recursively and discuss stack depth.

## Similar problems
Remove Nth Node From End of List (LeetCode 19) is this problem. Middle of the Linked List (LeetCode 876) uses the same runner idea with different speeds, and Rotate List (LeetCode 61) uses a gap to find the new tail.
