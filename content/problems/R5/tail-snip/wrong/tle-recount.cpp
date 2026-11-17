class Solution {
public:
    ListNode* snipFromEnd(ListNode* head, int n) {
        // Wrong (too slow): for every node, walk to the end to count how many nodes follow it.
        ListNode anchor(0, head);
        for (ListNode* prev = &anchor; prev->next != nullptr; prev = prev->next) {
            int after = 0;
            for (ListNode* p = prev->next->next; p != nullptr; p = p->next) ++after;
            if (after == n - 1) {
                prev->next = prev->next->next;
                break;
            }
        }
        return anchor.next;
    }
};
