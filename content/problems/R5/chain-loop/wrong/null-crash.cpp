class Solution {
public:
    bool chainLoop(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        // Wrong: no null checks, so a list that ends crashes the fast cursor.
        while (true) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
    }
};
