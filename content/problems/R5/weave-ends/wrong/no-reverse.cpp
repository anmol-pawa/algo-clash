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
        ListNode* back = slow->next;  // Wrong: the second half is not reversed, so it interleaves in the original order.
        slow->next = nullptr;
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
