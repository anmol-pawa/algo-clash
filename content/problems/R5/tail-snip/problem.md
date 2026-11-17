# Tail Snip

A cave chain has one cracked lantern, and the guides know only how far it hangs **from the deep end**: the `n`-th lantern counting backwards from the last one (the last lantern is number 1). Cut that lantern out of the chain and keep everything else in order.

Given `head`, the first node of a singly linked list, and an integer `n`, remove the `n`-th node from the end by rewiring `next` pointers and return the head of the resulting list. The list may become empty. Try to do it in **one pass** over the list.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `head = [1,2,3,4,5]`, `n = 2` gives `[1,2,3,5]`.
- `head = [1,2,3]`, `n = 3` gives `[2,3]` (the first node goes).
- `head = [8]`, `n = 1` gives `[]`.
- `head = [4,6]`, `n = 1` gives `[4]`.

## Constraints

- `1 <= length <= 100000`
- `1 <= n <= length`
- `-1000000000 <= val <= 1000000000`
