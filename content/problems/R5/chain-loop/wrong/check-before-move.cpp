class Solution {
public:
    bool chainLoop(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        // Wrong: compares before moving, and both start on the head, so any non-empty list is "cyclic".
        while (fast != nullptr && fast->next != nullptr) {
            if (slow == fast) return true;
            slow = slow->next;
            fast = fast->next->next;
        }
        return false;
    }
};
