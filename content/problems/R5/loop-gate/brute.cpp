class Solution {
public:
    ListNode* loopGate(ListNode* head) {
        unordered_set<const ListNode*> seen;
        for (ListNode* n = head; n != nullptr; n = n->next) {
            if (!seen.insert(n).second) return n;
        }
        return nullptr;
    }
};
