class Solution {
public:
    ListNode* forkPoint(ListNode* a, ListNode* b) {
        // Wrong: matches nodes by value, so equal values in different nodes look like a fork.
        for (ListNode* x = a; x != nullptr; x = x->next) {
            for (ListNode* y = b; y != nullptr; y = y->next) {
                if (x->val == y->val) return x;
            }
        }
        return nullptr;
    }
};
