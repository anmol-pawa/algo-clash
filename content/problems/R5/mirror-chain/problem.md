# Mirror Chain

A string of beads is called a *mirror* when reading its values from the first bead to the last gives the same sequence as reading from the last bead to the first.

Given `head` of a singly linked list, return `true` if the list is a mirror and `false` otherwise. An empty list and a single bead are mirrors.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `head = [1,2,2,1]` gives `true`.
- `head = [1,2,3,2,1]` gives `true`.
- `head = [1,2,3,1]` gives `false`.
- `head = [5]` gives `true`.

## Constraints

- `0 <= length <= 100000`
- `-1000000000 <= val <= 1000000000`
- The follow-up asks for O(1) extra memory beyond the list itself. Your function may change the list while it works, but it is polite to put it back.
