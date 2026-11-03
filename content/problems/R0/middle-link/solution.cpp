class Solution {
public:
    ListNode* middleLink(ListNode* head) {
        int n = 0;
        for (ListNode* cur = head; cur != nullptr; cur = cur->next) ++n;
        for (int i = 0; i < n / 2; ++i) head = head->next;  // n/2 steps stays inside the list
        return head;
    }
};
