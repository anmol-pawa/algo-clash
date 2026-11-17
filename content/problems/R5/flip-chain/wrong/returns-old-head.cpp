class Solution {
public:
    ListNode* flipChain(ListNode* head) {
        ListNode* original = head;
        ListNode* reversed = nullptr;
        while (head != nullptr) {
            ListNode* rest = head->next;
            head->next = reversed;
            reversed = head;
            head = rest;
        }
        // Wrong: the old first node is now the tail, so this prints just one value.
        return original;
    }
};
