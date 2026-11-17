class Solution {
public:
    ListNode* snipFromEnd(ListNode* head, int n) {
        ListNode anchor(0, head);
        ListNode* lead = &anchor;
        // Wrong: the gap is n + 1 on a chain that already starts at the dummy, so the node before the target is removed.
        for (int i = 0; i <= n && lead != nullptr; ++i) lead = lead->next;
        ListNode* trail = &anchor;
        while (lead != nullptr && lead->next != nullptr) {
            lead = lead->next;
            trail = trail->next;
        }
        if (trail->next != nullptr) trail->next = trail->next->next;
        return anchor.next;
    }
};
