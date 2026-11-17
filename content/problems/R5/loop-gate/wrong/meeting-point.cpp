class Solution {
public:
    ListNode* loopGate(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        // Wrong: returns where the runners meet, which is inside the cycle, not necessarily the gate.
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return slow;
        }
        return nullptr;
    }
};
