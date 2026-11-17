class Solution {
public:
    ListNode* reverseChain(ListNode* head) {
        // Wrong: swaps neighbouring values pairwise, which only equals a reversal for length 2 or less.
        for (ListNode* p = head; p != nullptr && p->next != nullptr; p = p->next->next) swap(p->val, p->next->val);
        return head;
    }
};
