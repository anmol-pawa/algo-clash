class Solution {
public:
    ListNode* forkPoint(ListNode* a, ListNode* b) {
        // Wrong: finds out whether the lists join (same last node) but returns that last node,
        // not the first shared one.
        if (a == nullptr || b == nullptr) return nullptr;
        ListNode* ta = a;
        ListNode* tb = b;
        while (ta->next != nullptr) ta = ta->next;
        while (tb->next != nullptr) tb = tb->next;
        return ta == tb ? ta : nullptr;
    }
};
