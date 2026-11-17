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
        // Wrong: head->next was overwritten in the first iteration, so this is not the first even wagon.
        odd->next = head->next;
        return head;
    }
};
