# Chain Loop

A guide follows a lantern chain through the caves, but some chains were hung wrongly: the last lantern is tied back to an earlier one, and the guide walks in circles forever. Decide whether a singly linked list **contains a cycle**: whether some node can be reached again by following `next` pointers.

You may not change the list, and you should use only a constant amount of extra memory.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## How the list is written

A test writes a list as `[values]@pos`. The values are the nodes in order, and `@pos` says that the **last node's `next` points back to the node at index `pos`**. `@-1` means the last node points to `nullptr`, so there is no cycle. You never receive `pos`, only the head.

## Examples

- `head = [3,2,0,-4]@1` gives `true` (the last node links back to the node holding 2).
- `head = [1,2]@0` gives `true`.
- `head = [1]@-1` gives `false`.
- `head = []@-1` gives `false`.

## Constraints

- `0 <= length <= 100000`
- `-1000000000 <= val <= 1000000000`
- Values may repeat. Two different nodes can hold the same value.
