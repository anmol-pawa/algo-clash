class Solution {
public:
    ListNode* parityRails(ListNode* head) {
        // Wrong: groups by the parity of the stored value instead of the position.
        ListNode oddDummy(0), evenDummy(0);
        ListNode* oddTail = &oddDummy;
        ListNode* evenTail = &evenDummy;
        for (ListNode* p = head; p != nullptr;) {
            ListNode* following = p->next;
            p->next = nullptr;
            if (p->val % 2 != 0) { oddTail->next = p; oddTail = p; }
            else { evenTail->next = p; evenTail = p; }
            p = following;
        }
        oddTail->next = evenDummy.next;
        return oddDummy.next;
    }
};
