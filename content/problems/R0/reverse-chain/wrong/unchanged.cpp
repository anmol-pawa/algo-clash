class Solution {
public:
    ListNode* reverseChain(ListNode* head) {
        // Wrong: walks the chain but returns the old head without relinking anything.
        ListNode* cur = head;
        while (cur != nullptr) cur = cur->next;
        return head;
    }
};
