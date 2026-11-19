# Relay Flip

A relay of lantern posts hangs along one tunnel, linked front to back. The guides want it rearranged in blocks: take the first `k` posts and reverse their order, then the next `k` posts and reverse them, and so on. If fewer than `k` posts remain at the end, leave that last short block exactly as it is.

Given `head`, the head of a singly linked list, and an integer `k`, rewire the **existing nodes** so that every full block of `k` nodes is reversed, and return the new head. Do not change node values and do not allocate new nodes.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `head = [1,2,3,4,5]`, `k = 2` gives `[2,1,4,3,5]`.
- `head = [1,2,3,4,5]`, `k = 3` gives `[3,2,1,4,5]`.
- `head = [1,2,3,4,5,6]`, `k = 3` gives `[3,2,1,6,5,4]`.
- `head = [7,8]`, `k = 1` gives `[7,8]`.

## Constraints

- `0 <= length of the list <= 100000`
- `1 <= k <= 100000`
- `-1000000000 <= val <= 1000000000`
