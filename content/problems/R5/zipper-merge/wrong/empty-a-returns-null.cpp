class Solution {
public:
    ListNode* zipMerge(ListNode* a, ListNode* b) {
        // Wrong: an empty first list is treated as "nothing to merge".
        if (a == nullptr) return nullptr;
        ListNode anchor;
        ListNode* tail = &anchor;
        while (a != nullptr && b != nullptr) {
            if (b->val < a->val) { tail->next = b; b = b->next; }
            else { tail->next = a; a = a->next; }
            tail = tail->next;
        }
        tail->next = (a != nullptr) ? a : b;
        return anchor.next;
    }
};
