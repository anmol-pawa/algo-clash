class Solution {
public:
    ListNode* spinChain(ListNode* head, int k) {
        if (head == nullptr || head->next == nullptr) return head;
        int length = 0;
        for (ListNode* p = head; p != nullptr; p = p->next) ++length;
        // Correct but quadratic: each spin walks to the end to detach the last node.
        for (int spin = 0; spin < k % length; ++spin) {
            ListNode* beforeLast = head;
            while (beforeLast->next->next != nullptr) beforeLast = beforeLast->next;
            ListNode* last = beforeLast->next;
            beforeLast->next = nullptr;
            last->next = head;
            head = last;
        }
        return head;
    }
};
