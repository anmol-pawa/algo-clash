# Reverse Chain

A chain of beads is a singly linked list: each `ListNode` holds an `int val` and a `next` pointer, and the last bead's `next` is `nullptr`.

Reverse the chain and return the new first bead. Reuse the existing nodes by changing their `next` pointers; do not build a new chain.

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};
```

## Examples

- `head = [1, 2, 3, 4]` gives `[4, 3, 2, 1]`.
- `head = [7, 8]` gives `[8, 7]`.
- `head = [5]` gives `[5]`.
- `head = []` gives `[]` (an empty chain is just `nullptr`).

## Constraints

- `0 <= length <= 100000`
- `-1000000000 <= val <= 1000000000`
