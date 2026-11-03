class Solution {
public:
    ListNode* dropNegatives(ListNode* head) {
        // Wrong: never sets tail->next = nullptr, so a trailing negative node stays attached.
        ListNode dummy(0);
        ListNode* tail = &dummy;
        for (ListNode* cur = head; cur != nullptr; cur = cur->next) {
            if (cur->val >= 0) {
                tail->next = cur;
                tail = cur;
            }
        }
        return dummy.next;
    }
};
