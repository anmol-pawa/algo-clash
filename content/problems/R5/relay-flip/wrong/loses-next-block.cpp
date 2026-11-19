class Solution {
public:
    ListNode* flipRelays(ListNode* head, int k) {
        ListNode anchor;
        anchor.next = head;
        ListNode* groupPrev = &anchor;
        while (true) {
            ListNode* kth = groupPrev;
            for (int i = 0; i < k && kth != nullptr; ++i) kth = kth->next;
            if (kth == nullptr) break;
            ListNode* groupNext = kth->next;
            // Wrong: reverses with prev = nullptr and never reconnects the old first node to groupNext,
            // so every block ends the list (the rest of the relay is cut off).
            ListNode* prev = nullptr;
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
