## Signals
"Several sorted sequences, produce one sorted sequence" is a k-way merge. The two-list merge from Zipper Merge works because only two front nodes compete. Here `k` fronts compete, so you need a way to find the smallest of `k` values repeatedly.

## Brute force
Copy every value into a `vector`, sort it, and rebuild a list. It is correct but costs O(N log N) time and O(N) extra space, and it throws away the fact that every input is already sorted. A second tempting idea merges tunnels one at a time into an accumulator. That is correct, but the accumulator grows, so the work is about `k * N / 2` node visits in the worst case: with 50000 tunnels of two nodes each that is billions of steps.

## Key insight
The next node of the answer is always the front of some tunnel, so there are at most `k` candidates. A min-heap holds exactly those candidates: pop the smallest, then push the node that follows it in its own tunnel (the new candidate from that tunnel). Every node is pushed once and popped once.

## Optimal
Build a `priority_queue` of `ListNode*` with a comparator that puts the **smallest** `val` on top (`a->val > b->val`, because `priority_queue` is a max-heap by default). Push every non-null head. With a stack dummy `anchor` and `tail = &anchor`, loop while the heap is non-empty: take the top `node`, pop, link `tail->next = node`, advance `tail`, and push `node->next` if it is not null. Finish with `tail->next = nullptr` is unnecessary because the last node's `next` is already null. Time is O(N log k) and extra space O(k).

The equally optimal alternative merges lists in rounds: while more than one list remains, merge list 0 with list 1, 2 with 3, and so on (carrying an odd leftover list into the next round). There are about log k rounds and each round touches every node once, so O(N log k) time and O(1) extra space beyond the vector.

## C++ walkthrough
`priority_queue<ListNode*, vector<ListNode*>, Cmp>` needs a comparator type; a small struct with `bool operator()(const ListNode* a, const ListNode* b) const { return a->val > b->val; }` is the cleanest. Remember the inverted comparison: "less" in a `priority_queue` means "comes out later". Ties may come out in any order because nodes with equal values are interchangeable in this problem (if they carried payloads you would add the tunnel index as a tie-breaker to stay stable).

## Common bugs
Pushing a null head and dereferencing it (empty tunnels are legal); a max-heap comparator that builds a descending list; forgetting to push `node->next` so tunnels are cut short; merging pairs but dropping the odd list out; using the accumulator approach and timing out at large `k`; returning the dummy instead of `anchor.next`.

## Follow-ups
Do it with the pairwise rounds and no heap (O(1) extra space); stream the merged output when the lists are too large for memory (external merge sort uses exactly this heap); merge `k` sorted arrays and return the `kth` smallest without finishing; discuss why the heap beats sequential merging as `k` grows.

## Similar problems
Merge k Sorted Lists (LeetCode 23) is this problem. Merge Two Sorted Lists (LeetCode 21) is the base case, Sort List (LeetCode 148) is a recursive use of the same merge, and Smallest Range Covering Elements from K Lists (LeetCode 632) is a heap of fronts with a twist.
