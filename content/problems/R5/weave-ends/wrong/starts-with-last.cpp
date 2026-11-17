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
        ListNode* back = nullptr;
        ListNode* cursor = slow->next;
        slow->next = nullptr;
        while (cursor != nullptr) {
            ListNode* following = cursor->next;
            cursor->next = back;
            back = cursor;
            cursor = following;
        }
        // Wrong: the new head is the last node, so the pattern starts with the back half.
        ListNode* result = back != nullptr ? back : head;
        ListNode* front = head;
        while (back != nullptr) {
            ListNode* nextFront = front != nullptr ? front->next : nullptr;
            ListNode* nextBack = back->next;
            back->next = front;
            if (front != nullptr) front->next = nextBack;
            front = nextFront;
            back = nextBack;
        }
        return result;
    }
};
