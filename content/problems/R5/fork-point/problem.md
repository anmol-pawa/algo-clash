# Fork Point

Two lantern chains run through the caves. Deep down they may be tied into the **same** chain: from some lantern onward, both chains continue through exactly the same lanterns. The guides want the **fork point**: the first lantern the two chains have in common.

Given the heads `a` and `b` of two singly linked lists, return the first node that belongs to both lists, or `nullptr` if they never meet. Do not change either list, and use only a constant amount of extra memory.

The node type is provided:

```cpp
struct ListNode {
    int val;
    ListNode* next;
};
```

## How the lists are written

The first list is written as usual, `[values]`. The second is written `[own values]^i`: these are the lanterns only the second chain owns, and the **last of them points to the node at index `i` of the first list**. `^-1` means the chains never join. If the second list owns no lanterns of its own (`[]^i`), its head is simply node `i` of the first list. You never receive `i`, only the two heads.

Because nodes can hold equal values, the judge shows your answer as the **index** of the node you return in the first list (`-1` for `nullptr`). Returning a node that only the second list owns shows as `b0`, `b1`, and so on, and counts as a wrong answer.

## Examples

- `a = [4,1,8,4,5]`, `b = [5,6,1]^2` gives `2`: both chains continue `8,4,5` from there, so the node holding 8 is the fork point (the other 1s and 4s do not count, they are different nodes).
- `a = [1,2]`, `b = [3]^-1` gives `-1`.
- `a = [7,7,7]`, `b = []^0` gives `0` (the second chain is the first chain).

## Constraints

- `0 <= length of each list <= 100000`
- `-1000000000 <= val <= 1000000000`
- Values may repeat, and two different nodes can hold the same value.
- Once the lists share a node they share everything after it.
