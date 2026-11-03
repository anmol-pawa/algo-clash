class Solution {
public:
    ListNode* dropNegatives(ListNode* head) {
        ListNode dummy(0);              // sits before the real head, so "the last kept node" always exists
        ListNode* tail = &dummy;
        for (ListNode* cur = head; cur != nullptr; cur = cur->next) {
            if (cur->val >= 0) {
                tail->next = cur;
                tail = cur;
            }
        }
        tail->next = nullptr;           // close the kept chain
        return dummy.next;
    }
};
