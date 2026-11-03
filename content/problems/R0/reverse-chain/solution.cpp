class Solution {
public:
    ListNode* reverseChain(ListNode* head) {
        ListNode* prev = nullptr;  // head of the already-reversed part
        ListNode* cur = head;      // next bead to flip
        while (cur != nullptr) {
            ListNode* next = cur->next;  // save it before we overwrite the link
            cur->next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
};
