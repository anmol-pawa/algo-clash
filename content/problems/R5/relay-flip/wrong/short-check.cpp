class Solution {
public:
    ListNode* flipRelays(ListNode* head, int k) {
        ListNode anchor;
        anchor.next = head;
        ListNode* groupPrev = &anchor;
        while (true) {
            // Wrong: off by one, the walk covers only k - 1 nodes, so blocks are one node too small.
            ListNode* kth = groupPrev;
            for (int i = 0; i < k - 1 && kth != nullptr; ++i) kth = kth->next;
            if (kth == nullptr || kth == groupPrev) break;
            ListNode* groupNext = kth->next;
            ListNode* prev = groupNext;
            ListNode* cur = groupPrev->next;
            ListNode* blockTail = cur;
            while (cur != groupNext) {
                ListNode* after = cur->next;
                cur->next = prev;
                prev = cur;
                cur = after;
            }
            groupPrev->next = kth;
            groupPrev = blockTail;
        }
        return anchor.next;
    }
};
