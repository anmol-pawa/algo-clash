## Signals
"Sort a singly linked list" with up to 100000 nodes. There is no random access, so quicksort's partition and heapsort's index arithmetic do not fit, and `O(n^2)` insertion sort is too slow. The shape "split at the middle, solve both halves, combine" is merge sort.

## Brute force
Copy the values into a `vector`, call `std::sort`, and rebuild the list. It is O(n log n) time but uses O(n) extra memory and replaces the nodes you were given. Insertion sort on the list re-links nodes without copying, but each insertion walks the sorted prefix, so it is O(n^2): about 2.5 * 10^9 hops for 100000 random values.

## Key insight
A list is bad at jumping and good at re-linking. Merge sort uses only what lists are good at: finding a middle is one pass, cutting is one pointer write, and merging two sorted lists re-links each node once, with no copying.

## Optimal
1. Base case: zero or one node is already sorted.
2. Find the middle with `slow = head`, `fast = head->next`; loop while `fast && fast->next`. `slow` ends on the last node of the first half. Set `second = slow->next` and `slow->next = nullptr`.
3. Recurse on both halves.
4. Merge with a dummy head, taking from the second list only when its value is strictly smaller (ties go to the first list, which keeps the sort **stable**). Attach whichever list still has nodes.

The recursion depth is about log2(n) (17 for 100000 nodes), each level touches every node once: time O(n log n), space O(log n) for the call stack. A bottom-up version merges runs of size 1, 2, 4, ... with an iterative loop and needs O(1) extra space.

## C++ walkthrough
Starting `fast` at `head->next` matters: with both at `head`, a two-node list leaves `slow` on the second node, the second half comes out empty, and the first half is the whole list again, so the recursion never shrinks. Cutting with `slow->next = nullptr` is what makes the halves independent lists. Compare with `<` rather than subtracting: `a->val - b->val` happens to fit in `int` for these limits (the largest gap is 2 * 10^9), but it overflows as soon as the range grows, so it is a habit worth avoiding.

## Common bugs
A split that does not shrink the problem (infinite recursion); forgetting to cut the first half; losing the leftover run when one list runs out; a single bubble pass mistaken for a sort; returning `head` instead of the merged head; insertion sort that is correct but quadratic.

## Follow-ups
Do it bottom-up in O(1) extra space; prove the sort is stable; sort a doubly linked list; discuss why `std::list::sort` is a merge sort while `std::sort` demands random-access iterators; sort a list that is nearly sorted (natural merge sort over existing runs).

## Similar problems
Sort List (LeetCode 148) is this problem. Merge Two Sorted Lists (LeetCode 21) is the merge step and Middle of the Linked List (LeetCode 876) is the split step. Insertion Sort List (LeetCode 147) is the quadratic baseline.
