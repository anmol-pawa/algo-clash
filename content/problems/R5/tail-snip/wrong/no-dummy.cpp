class Solution {
public:
    ListNode* snipFromEnd(ListNode* head, int n) {
        // Wrong: no dummy head, so removing the first node dereferences a null "previous" node.
        ListNode* lead = head;
        for (int i = 0; i < n; ++i) lead = lead->next;
        ListNode* trail = head;
        while (lead != nullptr && lead->next != nullptr) {
            lead = lead->next;
            trail = trail->next;
        }
        trail->next = trail->next->next;
        return head;
    }
};
