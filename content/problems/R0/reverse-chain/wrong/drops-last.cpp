class Solution {
public:
    ListNode* reverseChain(ListNode* head) {
        // Wrong: the loop stops while the last bead is still unflipped, so it never joins the result.
        ListNode* prev = nullptr;
        ListNode* cur = head;
        while (cur != nullptr && cur->next != nullptr) {
            ListNode* next = cur->next;
            cur->next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
};
