class Solution {
public:
    ListNode* sortChain(ListNode* head) {
        // Wrong: a single bubble pass only moves the maximum to the end.
        for (ListNode* p = head; p != nullptr && p->next != nullptr; p = p->next)
            if (p->val > p->next->val) swap(p->val, p->next->val);
        return head;
    }
};
