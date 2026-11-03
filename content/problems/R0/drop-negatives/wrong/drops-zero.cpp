class Solution {
public:
    ListNode* dropNegatives(ListNode* head) {
        // Wrong: also removes zeros (<= 0 instead of < 0).
        ListNode dummy(0);
        ListNode* tail = &dummy;
        for (ListNode* cur = head; cur != nullptr; cur = cur->next) {
            if (cur->val > 0) {
                tail->next = cur;
                tail = cur;
            }
        }
        tail->next = nullptr;
        return dummy.next;
    }
};
