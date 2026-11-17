class Solution {
public:
    ListNode* addDigits(ListNode* a, ListNode* b) {
        // Wrong (too slow): appends every digit by walking from the head to the current end.
        ListNode* head = nullptr;
        int carry = 0;
        while (a != nullptr || b != nullptr || carry != 0) {
            int sum = carry;
            if (a != nullptr) { sum += a->val; a = a->next; }
            if (b != nullptr) { sum += b->val; b = b->next; }
            ListNode* node = new ListNode(sum % 10);
            if (head == nullptr) head = node;
            else {
                ListNode* end = head;
                while (end->next != nullptr) end = end->next;
                end->next = node;
            }
            carry = sum / 10;
        }
        return head;
    }
};
