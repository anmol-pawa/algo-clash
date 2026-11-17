class Solution {
public:
    ListNode* zipMerge(ListNode* a, ListNode* b) {
        ListNode anchor;
        ListNode* tail = &anchor;
        while (a != nullptr && b != nullptr) {
            if (b->val < a->val) { tail->next = b; b = b->next; }
            else { tail->next = a; a = a->next; }
            tail = tail->next;
        }
        // Wrong: the nodes left in the longer list are never attached.
        tail->next = nullptr;
        return anchor.next;
    }
};
