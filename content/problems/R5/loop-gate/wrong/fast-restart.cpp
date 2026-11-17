class Solution {
public:
    ListNode* loopGate(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) {
                // Wrong: the restarted walker should move one node per step, not two.
                ListNode* finder = head;
                int guard = 0;
                while (finder != slow && guard++ < 1000000) {
                    finder = finder->next->next ? finder->next->next : finder->next;
                    slow = slow->next;
                }
                return finder;
            }
        }
        return nullptr;
    }
};
