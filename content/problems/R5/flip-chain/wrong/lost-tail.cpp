class Solution {
public:
    ListNode* flipChain(ListNode* head) {
        ListNode* reversed = nullptr;
        while (head != nullptr) {
            // Wrong: the link to the rest of the list is overwritten before it is saved.
            head->next = reversed;
            reversed = head;
            head = head->next;
        }
        return reversed;
    }
};
