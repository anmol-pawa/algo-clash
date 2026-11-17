class Solution {
public:
    ListNode* midLink(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        // Wrong: reads fast->next without checking fast, so an empty list crashes.
        while (fast->next != nullptr && fast->next->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }
        if (fast->next != nullptr) slow = slow->next;
        return slow;
    }
};
