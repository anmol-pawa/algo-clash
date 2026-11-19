class Solution {
public:
    ListNode* flipRelays(ListNode* head, int k) {
        ListNode anchor;
        anchor.next = head;
        ListNode* groupPrev = &anchor;
        while (groupPrev->next != nullptr) {
            // Wrong: finds the block end but stops early at a short block and reverses it anyway.
            ListNode* kth = groupPrev;
            for (int i = 0; i < k && kth->next != nullptr; ++i) kth = kth->next;
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
