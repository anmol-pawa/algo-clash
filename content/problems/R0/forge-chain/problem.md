# Forge Chain

Build a singly linked list from an array: the first value becomes the head, the second value the next node, and so on. Return the head. For an empty array return `nullptr`.

You create nodes with `new`. In interviews you normally do not free them, and you may say so aloud.

(The node type is the usual `ListNode` with `val` and `next`; `ListNode(int x)` and `ListNode(int x, ListNode* next)` constructors exist.)

## Examples

- `values = [1,2,3]` gives the list `[1,2,3]`.
- `values = [7]` gives `[7]`.
- `values = [0,0]` gives `[0,0]`.
- `values = []` gives `[]`.

## Constraints

- `0 <= values.size() <= 100000`
- `-1000 <= values[i] <= 1000`
