class Solution {
public:
    ListNode* addDigits(ListNode* a, ListNode* b) {
        ListNode anchor;
        ListNode* tail = &anchor;
        int carry = 0;
        while (a != nullptr && b != nullptr) {
            int sum = a->val + b->val + carry;
            tail->next = new ListNode(sum % 10);
            tail = tail->next;
            carry = sum / 10;
            a = a->next;
            b = b->next;
        }
        // Wrong: the leftover digits are attached as they are, so a pending carry never propagates into them.
        ListNode* rest = (a != nullptr) ? a : b;
        if (carry != 0 && rest == nullptr) tail->next = new ListNode(carry);
        else tail->next = rest;
        return anchor.next;
    }
};
