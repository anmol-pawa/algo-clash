class Solution {
public:
    ListNode* loopGate(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        // Phase 1: find a node inside the cycle, or discover there is none.
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) {
                // Phase 2: the distance from the head to the gate equals the distance from here
                // to the gate (modulo whole laps), so walk both one step at a time.
                ListNode* finder = head;
                while (finder != slow) {
                    finder = finder->next;
                    slow = slow->next;
                }
                return finder;
            }
        }
        return nullptr;
    }
};
