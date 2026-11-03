class Solution {
public:
    ListNode* middleLink(ListNode* head) {
        // Wrong: walks n/2 + 1 steps, so a one-node list yields nullptr and other lists skip a node.
        int n = 0;
        for (ListNode* cur = head; cur != nullptr; cur = cur->next) ++n;
        for (int i = 0; i <= n / 2 && head != nullptr; ++i) head = head->next;
        return head;
    }
};
