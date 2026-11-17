class Solution {
public:
    ListNode* zipMerge(ListNode* a, ListNode* b) {
        ListNode anchor;
        ListNode* tail = &anchor;
        // Wrong: takes turns instead of comparing values.
        bool fromA = true;
        while (a != nullptr && b != nullptr) {
            if (fromA) { tail->next = a; a = a->next; }
            else { tail->next = b; b = b->next; }
            fromA = !fromA;
            tail = tail->next;
        }
        tail->next = (a != nullptr) ? a : b;
        return anchor.next;
    }
};
