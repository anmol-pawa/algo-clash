class Solution {
public:
    ListNode* weaveEnds(ListNode* head) {
        if (head == nullptr || head->next == nullptr) return head;

        // 1. Find the end of the first half. For odd lengths the middle node stays in the first half.
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast->next != nullptr && fast->next->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }

        // 2. Cut after the first half and reverse the second half in place.
        ListNode* back = nullptr;
        ListNode* cursor = slow->next;
        slow->next = nullptr;
        while (cursor != nullptr) {
            ListNode* following = cursor->next;
            cursor->next = back;
            back = cursor;
            cursor = following;
        }

        // 3. Interleave: one node from the front half, then one from the reversed back half.
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
