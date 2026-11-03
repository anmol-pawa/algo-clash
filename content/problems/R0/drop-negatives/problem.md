# Drop Negatives

A singly linked list of readings is given by its head. Remove every node whose value is negative and return the head of the remaining list, keeping the order of the survivors. The list may become empty, in which case return `nullptr`.

The list node is the usual one:

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};
```

## Examples

- `head = [3,-1,4]` gives `[3,4]`.
- `head = [-5,-2,7]` gives `[7]` (the head itself is removed).
- `head = [-1,-2]` gives `[]`.
- `head = []` gives `[]`.

## Constraints

- `0 <=` number of nodes `<= 100000`
- `-1000 <= val <= 1000`
