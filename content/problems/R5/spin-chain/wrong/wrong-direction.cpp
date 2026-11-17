class Solution {
public:
    ListNode* spinChain(ListNode* head, int k) {
        if (head == nullptr || head->next == nullptr || k == 0) return head;
        int length = 1;
        ListNode* tail = head;
        while (tail->next != nullptr) { tail = tail->next; ++length; }
        const int spins = k % length;
        if (spins == 0) return head;
        // Wrong: rotates left (the first `spins` nodes move to the back) instead of right.
        ListNode* newTail = head;
        for (int step = 0; step < spins - 1; ++step) newTail = newTail->next;
        ListNode* newHead = newTail->next;
        newTail->next = nullptr;
        tail->next = head;
        return newHead;
    }
};
