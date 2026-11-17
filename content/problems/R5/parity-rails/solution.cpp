class Solution {
public:
    ListNode* parityRails(ListNode* head) {
        if (head == nullptr || head->next == nullptr) return head;

        ListNode* odd = head;               // tail of the odd-position rail
        ListNode* evenHead = head->next;    // remembered so the rails can be joined at the end
        ListNode* even = evenHead;          // tail of the even-position rail

        // Invariant: odd and even are the current tails; every node before them is already on its rail.
        while (even != nullptr && even->next != nullptr) {
            odd->next = even->next;
            odd = odd->next;
            even->next = odd->next;
            even = even->next;
        }
        odd->next = evenHead;  // the last odd node now hands over to the even rail
        return head;
    }
};
