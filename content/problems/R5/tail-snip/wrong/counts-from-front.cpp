class Solution {
public:
    ListNode* snipFromEnd(ListNode* head, int n) {
        // Wrong: removes the n-th node from the front.
        ListNode anchor(0, head);
        ListNode* prev = &anchor;
        for (int i = 1; i < n && prev->next != nullptr; ++i) prev = prev->next;
        if (prev->next != nullptr) prev->next = prev->next->next;
        return anchor.next;
    }
};
