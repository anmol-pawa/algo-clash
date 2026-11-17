class Solution {
public:
    ListNode* weaveEnds(ListNode* head) {
        if (head == nullptr || head->next == nullptr) return head;
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast->next != nullptr && fast->next->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }
        slow = slow->next;  // Wrong: one step too far, so the front half keeps a node that belongs to the back half.
        ListNode* back = nullptr;
        ListNode* cursor = (slow != nullptr) ? slow->next : nullptr;
        if (slow != nullptr) slow->next = nullptr;
        while (cursor != nullptr) {
            ListNode* following = cursor->next;
            cursor->next = back;
            back = cursor;
            cursor = following;
        }
        ListNode* front = head;
        while (back != nullptr) {
            ListNode* nextFront = front->next;
            ListNode* nextBack = back->next;
            front->next = back;
            back->next = nextFront;
            front = nextFront;
            back = nextBack;
        }
        return head;
    }
};
