class Solution {
public:
    bool chainLoop(ListNode* head) {
        // Wrong: remembers values, so two different nodes with equal values look like a cycle.
        unordered_set<int> seen;
        for (ListNode* n = head; n != nullptr; n = n->next) {
            if (!seen.insert(n->val).second) return true;
        }
        return false;
    }
};
