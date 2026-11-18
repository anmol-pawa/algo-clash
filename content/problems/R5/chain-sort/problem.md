# Chain Sort

The lantern guides want a chain hung in **increasing** order of brightness, but the only tool they have is a pair of hands that can re-link `next` pointers. Nobody can jump to the middle of a chain.

Given `head`, the first node of a singly linked list, return the head of the same nodes arranged in non-decreasing order of `val`. Aim for `O(n log n)` time.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `head = [4,2,1,3]` gives `[1,2,3,4]`.
- `head = [-1,5,3,4,0]` gives `[-1,0,3,4,5]`.
- `head = [7,7,7]` gives `[7,7,7]`.
- `head = []` gives `[]`.

## Constraints

- `0 <= length <= 100000`
- `-1000000000 <= val <= 1000000000`
