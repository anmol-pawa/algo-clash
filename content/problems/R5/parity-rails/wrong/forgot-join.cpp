class Solution {
public:
    ListNode* parityRails(ListNode* head) {
        if (head == nullptr || head->next == nullptr) return head;
        ListNode* odd = head;
        ListNode* even = head->next;
        while (even != nullptr && even->next != nullptr) {
            odd->next = even->next;
            odd = odd->next;
            even->next = odd->next;
            even = even->next;
        }
        // Wrong: the odd rail is never linked to the even rail, so the even wagons are lost.
        return head;
    }
};
