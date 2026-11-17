# Weave Ends

The guides want a lantern chain re-hung so that it alternates between the two ends. If the chain is `L0 -> L1 -> L2 -> ... -> L(k-1)`, it must become

`L0 -> L(k-1) -> L1 -> L(k-2) -> L2 -> L(k-3) -> ...`

until every lantern has been used once.

Given `head`, rearrange the list **in place** by changing `next` pointers (do not change any `val` and do not allocate new nodes) and return the head of the rearranged list.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `head = [1,2,3,4]` gives `[1,4,2,3]`.
- `head = [1,2,3,4,5]` gives `[1,5,2,4,3]`.
- `head = [6]` gives `[6]`.
- `head = []` gives `[]`.

## Constraints

- `0 <= length <= 100000`
- `-1000000000 <= val <= 1000000000`
- Use O(1) extra memory beyond the list itself.
