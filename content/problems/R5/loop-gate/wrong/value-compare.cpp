class Solution {
public:
    ListNode* loopGate(ListNode* head) {
        // Wrong: treats the first repeated value as the gate, so equal values in the tail fool it.
        unordered_set<int> seen;
        for (ListNode* n = head; n != nullptr; n = n->next) {
            if (!seen.insert(n->val).second) return n;
        }
        return nullptr;
    }
};
