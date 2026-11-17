class Solution {
public:
    ListNode* midLink(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        // Wrong: stops one step early, so an even-length list returns the first middle.
        while (fast != nullptr && fast->next != nullptr && fast->next->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }
        return slow;
    }
};
