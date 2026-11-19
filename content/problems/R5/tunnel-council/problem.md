# Tunnel Council

The cave has `k` tunnels. Each tunnel holds lanterns ordered from dimmest to brightest. The council wants a single tunnel holding every lantern, still ordered from dimmest to brightest.

Given `tunnels`, a vector of the heads of `k` singly linked lists, each sorted in **non-decreasing** order (a head may be `nullptr`, meaning an empty tunnel), merge them into one sorted list by **splicing the existing nodes** (do not allocate new nodes). Return the head of the merged list.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `tunnels = [[1,4,5],[1,3,4],[2,6]]` gives `[1,1,2,3,4,4,5,6]`.
- `tunnels = [[],[7]]` gives `[7]`.
- `tunnels = [[],[]]` gives `[]`.
- `tunnels = []` gives `[]`.

## Constraints

- `0 <= k <= 50000`
- `0 <= total number of nodes N <= 100000`
- `-1000000000 <= val <= 1000000000`
- Every input list is sorted in non-decreasing order.
