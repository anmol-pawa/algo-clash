class Solution {
public:
    ListNode* snipFromEnd(ListNode* head, int n) {
        ListNode anchor(0, head);  // dummy head: removing the first node needs no special case
        ListNode* lead = &anchor;
        for (int i = 0; i < n; ++i) lead = lead->next;  // lead is now n nodes ahead of trail
        ListNode* trail = &anchor;
        // When lead stands on the last node, trail stands on the node just before the target.
        while (lead->next != nullptr) {
            lead = lead->next;
            trail = trail->next;
        }
        ListNode* doomed = trail->next;
        trail->next = doomed->next;
        delete doomed;
        return anchor.next;
    }
};
