# Mid Link

The guides must cut a lantern chain in half, but nobody knows how long it is. Find the **middle node** of a singly linked list and return it (the list from that node to the end is the answer).

When the length is even there are two middle nodes: return the **second** one. For an empty list, return `nullptr`.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `head = [1,2,3,4,5]` gives `[3,4,5]`.
- `head = [1,2,3,4]` gives `[3,4]` (the second of the two middles).
- `head = [8]` gives `[8]`.
- `head = []` gives `[]`.

## Constraints

- `0 <= length <= 100000`
- `-1000000000 <= val <= 1000000000`
