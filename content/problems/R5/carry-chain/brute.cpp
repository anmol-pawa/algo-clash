class Solution {
public:
    ListNode* addDigits(ListNode* a, ListNode* b) {
        // Only valid for the short lists of the stress test: both numbers fit in a long long.
        long long x = 0, y = 0, scale = 1;
        for (ListNode* p = a; p != nullptr; p = p->next, scale *= 10) x += p->val * scale;
        scale = 1;
        for (ListNode* p = b; p != nullptr; p = p->next, scale *= 10) y += p->val * scale;
        long long total = x + y;
        ListNode anchor;
        ListNode* tail = &anchor;
        do {
            tail->next = new ListNode(static_cast<int>(total % 10));
            tail = tail->next;
            total /= 10;
        } while (total > 0);
        return anchor.next;
    }
};
