class Solution {
public:
    ListNode* addDigits(ListNode* a, ListNode* b) {
        // Wrong: rebuilds the numbers as 64-bit integers, which overflow after 18 digits.
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
