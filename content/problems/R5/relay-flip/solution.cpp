class Solution {
public:
    ListNode* flipRelays(ListNode* head, int k) {
        ListNode anchor;  // dummy head: the first block needs no special case
        anchor.next = head;
        ListNode* groupPrev = &anchor;  // invariant: everything up to groupPrev is final
        while (true) {
            ListNode* kth = groupPrev;
            for (int i = 0; i < k && kth != nullptr; ++i) kth = kth->next;
            if (kth == nullptr) break;  // fewer than k nodes remain: leave them as they are
            ListNode* groupNext = kth->next;
            // Reverse the block; starting with prev = groupNext links the old first node to the rest.
            ListNode* prev = groupNext;
            ListNode* cur = groupPrev->next;
            ListNode* blockTail = cur;  // the old first node becomes the block's tail
            while (cur != groupNext) {
                ListNode* after = cur->next;
                cur->next = prev;
                prev = cur;
                cur = after;
            }
            groupPrev->next = kth;  // kth is the new front of the block
            groupPrev = blockTail;
        }
        return anchor.next;
    }
};
