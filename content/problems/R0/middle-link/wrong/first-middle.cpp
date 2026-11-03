class Solution {
public:
    ListNode* middleLink(ListNode* head) {
        // Wrong: picks the FIRST middle for even lengths.
        int n = 0;
        for (ListNode* cur = head; cur != nullptr; cur = cur->next) ++n;
        for (int i = 0; i < (n - 1) / 2; ++i) head = head->next;
        return head;
    }
};
