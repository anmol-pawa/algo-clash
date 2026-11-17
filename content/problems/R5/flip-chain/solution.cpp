class Solution {
public:
    ListNode* flipChain(ListNode* head) {
        ListNode* reversed = nullptr;  // the already-flipped prefix, newest node first
        while (head != nullptr) {
            ListNode* rest = head->next;  // save the way forward before overwriting it
            head->next = reversed;
            reversed = head;
            head = rest;
        }
        return reversed;
    }
};
