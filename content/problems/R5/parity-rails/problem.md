# Parity Rails

Wagons are coupled in a line and numbered by position, starting at 1 for the first wagon. The yard master wants every wagon in an **odd position** first, then every wagon in an **even position**. Inside each group the wagons keep their original relative order.

Given `head`, regroup the list **in place** by changing `next` pointers (do not change any `val` and do not allocate new nodes) and return the head.

Note that the grouping is by *position* in the original list, never by the value stored in a wagon.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `head = [1,2,3,4,5]` gives `[1,3,5,2,4]`.
- `head = [2,1,3,5,6,4,7]` gives `[2,3,6,7,1,5,4]`.
- `head = [8,8]` gives `[8,8]`.
- `head = []` gives `[]`.

## Constraints

- `0 <= length <= 100000`
- `-1000000000 <= val <= 1000000000`
- Use O(1) extra memory beyond the list itself.
