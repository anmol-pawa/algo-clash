class Solution {
public:
    ListNode* zipMerge(ListNode* a, ListNode* b) {
        ListNode anchor;  // dummy head: the real head is anchor.next, so no first-node special case
        ListNode* tail = &anchor;
        while (a != nullptr && b != nullptr) {
            if (b->val < a->val) {
                tail->next = b;
                b = b->next;
            } else {
                tail->next = a;  // ties come from a first, so the merge is stable
                a = a->next;
            }
            tail = tail->next;
        }
        tail->next = (a != nullptr) ? a : b;  // at most one list still has nodes: attach it whole
        return anchor.next;
    }
};
