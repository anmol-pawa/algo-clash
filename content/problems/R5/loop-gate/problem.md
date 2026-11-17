# Loop Gate

Some lantern chains in the caves are hung so that the last lantern is tied back to an earlier one. The guides need the **gate**: the first lantern that is part of the loop, the one a walker reaches again after going all the way round.

Given the head of a singly linked list, return the node where the cycle **begins**, or `nullptr` if the list has no cycle. You may not change the list, and you should use only a constant amount of extra memory.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## How the list is written

A test writes a list as `[values]@pos`: the values are the nodes in order, and the **last node's `next` points back to the node at index `pos`**. `@-1` means the last node points to `nullptr`. You never receive `pos`, only the head.

Because nodes can hold equal values, the judge shows your answer as the **index** of the node you returned in that list (`-1` for `nullptr`). Returning a node that is not in the list is an error.

## Examples

- `head = [3,2,0,-4]@1` gives `1` (the node holding 2 is where the loop starts).
- `head = [1,2]@0` gives `0`.
- `head = [4,5,6]@-1` gives `-1` (no cycle).
- `head = [7]@0` gives `0` (a node that points to itself).

## Constraints

- `0 <= length <= 100000`
- `-1000000000 <= val <= 1000000000`
- Values may repeat. Two different nodes can hold the same value.
