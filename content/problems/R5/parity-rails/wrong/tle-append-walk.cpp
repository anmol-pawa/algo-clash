class Solution {
public:
    ListNode* parityRails(ListNode* head) {
        int n = 0;
        for (ListNode* p = head; p != nullptr; p = p->next) ++n;
        // Correct but quadratic: each even wagon is cut out and appended after walking to the tail again.
        ListNode* current = head;
        for (int k = 0; k < n / 2; ++k) {
            ListNode* moved = current->next;
            current->next = moved->next;
            moved->next = nullptr;
            ListNode* tail = head;
            while (tail->next != nullptr) tail = tail->next;
            tail->next = moved;
            current = current->next;
        }
        return head;
    }
};
