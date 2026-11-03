## Signals
Constructing a linked list: `new` for each node, plus a tail pointer so appends are O(1).

## Brute force
Walk to the end of the list from the head for every new value. O(n^2) time. Fine for small inputs; the checker builds from the back instead.

## Key insight
Keep a `tail` pointer. Each append is two assignments. A dummy head removes the empty-list special case.

## Optimal
O(n) time, O(n) space for the nodes themselves (that is the output, not extra work).

## C++ walkthrough
`new ListNode(value)` allocates one node on the heap and returns a pointer to it; the node outlives the function, unlike a local variable, which would dangle. `ListNode dummy(0);` lives on the stack and is fine because only `dummy.next` escapes. `for (const int v : values)` iterates without copying the vector's elements again.

## Common bugs
Returning `&dummy` or `dummy` rather than `dummy.next`, so the answer has an extra leading 0. Returning the tail instead of the head. Building in reverse by mistake. Creating a node on the stack (`ListNode node(v); tail->next = &node;`), which dangles as soon as the loop iteration ends. Dropping the last element with an off-by-one loop bound.

## Follow-ups
Build the list from the back with no dummy node. Build a list that is a cycle. Free the list correctly when asked to.

## Similar problems
Merge Two Sorted Lists (LeetCode 21) builds its result with the same tail-pointer idiom.
