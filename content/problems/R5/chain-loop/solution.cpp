class Solution {
public:
    bool chainLoop(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        // fast gains one node on slow each step, so inside a cycle they must meet.
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};
