class Solution {
public:
    ListNode* midLink(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        // fast moves two steps for every one of slow, so slow is halfway when fast runs out.
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }
        return slow;
    }
};
