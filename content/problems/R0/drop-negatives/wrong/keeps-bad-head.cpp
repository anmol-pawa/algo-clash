class Solution {
public:
    ListNode* dropNegatives(ListNode* head) {
        // Wrong: only looks at nodes after the head, so a negative head survives.
        if (head == nullptr) return nullptr;
        ListNode* cur = head;
        while (cur->next != nullptr) {
            if (cur->next->val < 0) cur->next = cur->next->next;
            else cur = cur->next;
        }
        return head;
    }
};
