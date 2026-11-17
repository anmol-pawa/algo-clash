# Flip Chain

A cave tunnel is a chain of lanterns. Each lantern knows only the **next** lantern deeper in the cave. The guides want the chain turned around, so the deepest lantern becomes the entrance and every lantern points back toward the old entrance.

Given `head`, the first node of a singly linked list, reverse the list **in place** by rewiring the `next` pointers (do not build a new list) and return the new head.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `head = [1,2,3,4]` gives `[4,3,2,1]`.
- `head = [7]` gives `[7]`.
- `head = []` gives `[]`.

## Constraints

- `0 <= length <= 100000`
- `-1000000000 <= val <= 1000000000`
