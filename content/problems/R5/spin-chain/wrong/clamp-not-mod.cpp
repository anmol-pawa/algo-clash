class Solution {
public:
    ListNode* spinChain(ListNode* head, int k) {
        if (head == nullptr || head->next == nullptr || k == 0) return head;
        int length = 1;
        ListNode* tail = head;
        while (tail->next != nullptr) { tail = tail->next; ++length; }
        // Wrong: k is clamped to the length instead of reduced modulo it, so k = length + 1 spins a whole turn.
        const int spins = std::min(k, length);
        if (spins == length) return head;
        ListNode* newTail = head;
        for (int step = 0; step < length - spins - 1; ++step) newTail = newTail->next;
        ListNode* newHead = newTail->next;
        newTail->next = nullptr;
        tail->next = head;
        return newHead;
    }
};
