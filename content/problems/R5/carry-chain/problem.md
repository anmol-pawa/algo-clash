# Carry Chain

The cave guides record huge counts as chains of lanterns. Each lantern shows one decimal digit, and the chain starts with the **least significant** digit (the ones place), then tens, then hundreds, and so on. The number `342` is the chain `[2,4,3]`.

Given `a` and `b`, the heads of two such chains, return the head of a new chain that holds their **sum**, in the same format.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## Examples

- `a = [2,4,3]`, `b = [5,6,4]` gives `[7,0,8]` (342 + 465 = 807).
- `a = [9,9,9]`, `b = [1]` gives `[0,0,0,1]` (999 + 1 = 1000).
- `a = [0]`, `b = [0]` gives `[0]`.
- `a = [5]`, `b = [7,1]` gives `[2,2]` (5 + 17 = 22).

## Constraints

- `1 <= length of each list <= 100000`
- Every `val` is a digit from `0` to `9`.
- A number has no leading zeros, except the number `0` itself, which is the single digit `[0]`.
- The sums are far too large for any built-in integer type.
