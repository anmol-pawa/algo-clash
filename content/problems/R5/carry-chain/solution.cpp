class Solution {
public:
    ListNode* addDigits(ListNode* a, ListNode* b) {
        ListNode anchor;  // dummy head: the answer starts at anchor.next
        ListNode* tail = &anchor;
        int carry = 0;
        // Keep going while either list has digits or a carry is still waiting.
        while (a != nullptr || b != nullptr || carry != 0) {
            int sum = carry;
            if (a != nullptr) {
                sum += a->val;
                a = a->next;
            }
            if (b != nullptr) {
                sum += b->val;
                b = b->next;
            }
            tail->next = new ListNode(sum % 10);
            tail = tail->next;
            carry = sum / 10;  // 0 or 1, since sum <= 9 + 9 + 1
        }
        return anchor.next;
    }
};
