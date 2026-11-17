class Solution {
public:
    ListNode* flipChain(ListNode* head) {
        // Wrong: only swaps the first two nodes.
        if (head == nullptr || head->next == nullptr) return head;
        ListNode* second = head->next;
        head->next = second->next;
        second->next = head;
        return second;
    }
};
