class Solution {
public:
    ListNode* middleLink(ListNode* head) {
        // Wrong: counts but never walks.
        int n = 0;
        for (ListNode* cur = head; cur != nullptr; cur = cur->next) ++n;
        return head;
    }
};
