# Spin Chain

A circular lantern chain was cut open and laid out as a list. One *spin* moves the **last** lantern to the front. Given `head` and a non-negative integer `k`, apply `k` spins and return the new head.

Do not change any `val`, and do not allocate new nodes. `k` may be much larger than the length of the list.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `head = [1,2,3,4,5], k = 2` gives `[4,5,1,2,3]`.
- `head = [10,20,30], k = 4` gives `[30,10,20]`.
- `head = [7,8], k = 0` gives `[7,8]`.
- `head = [], k = 5` gives `[]`.

## Constraints

- `0 <= length <= 100000`
- `-1000000000 <= val <= 1000000000`
- `0 <= k <= 2000000000`
