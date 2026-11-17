# Zipper Merge

Two cave tunnels each hold lanterns ordered from dimmest to brightest. The guides want one tunnel with every lantern, still ordered from dimmest to brightest.

Given `a` and `b`, the heads of two singly linked lists that are each sorted in **non-decreasing** order, merge them into one sorted list by **splicing the existing nodes** together (do not allocate new nodes). Return the head of the merged list.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `a = [1,3,5]`, `b = [2,4,6]` gives `[1,2,3,4,5,6]`.
- `a = [1,1]`, `b = [1]` gives `[1,1,1]`.
- `a = []`, `b = [9]` gives `[9]`.
- `a = []`, `b = []` gives `[]`.

## Constraints

- `0 <= length of each list <= 100000`
- `-1000000000 <= val <= 1000000000`
- Both input lists are sorted in non-decreasing order.
