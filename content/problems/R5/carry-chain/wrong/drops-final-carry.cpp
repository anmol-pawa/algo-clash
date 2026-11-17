class Solution {
public:
    ListNode* addDigits(ListNode* a, ListNode* b) {
        ListNode anchor;
        ListNode* tail = &anchor;
        int carry = 0;
        // Wrong: stops as soon as both lists end, so a last carry digit is lost (999 + 1).
        while (a != nullptr || b != nullptr) {
            int sum = carry;
            if (a != nullptr) { sum += a->val; a = a->next; }
            if (b != nullptr) { sum += b->val; b = b->next; }
            tail->next = new ListNode(sum % 10);
            tail = tail->next;
            carry = sum / 10;
        }
        return anchor.next;
    }
};
