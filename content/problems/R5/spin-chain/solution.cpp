class Solution {
public:
    ListNode* spinChain(ListNode* head, int k) {
        if (head == nullptr || head->next == nullptr || k == 0) return head;

        // Measure the list and find its tail.
        int length = 1;
        ListNode* tail = head;
        while (tail->next != nullptr) {
            tail = tail->next;
            ++length;
        }

        // A full turn changes nothing, so only k % length spins matter.
        const int spins = k % length;
        if (spins == 0) return head;

        // The new tail is the node that ends up last: index length - spins - 1.
        ListNode* newTail = head;
        for (int step = 0; step < length - spins - 1; ++step) newTail = newTail->next;

        ListNode* newHead = newTail->next;
        newTail->next = nullptr;  // cut the chain here
        tail->next = head;        // old end now hands over to the old front
        return newHead;
    }
};
