class Solution {
public:
    ListNode* forkPoint(ListNode* a, ListNode* b) {
        // Wrong (too slow): compare every node of a with every node of b.
        for (ListNode* x = a; x != nullptr; x = x->next) {
            for (ListNode* y = b; y != nullptr; y = y->next) {
                if (x == y) return x;
            }
        }
        return nullptr;
    }
};
