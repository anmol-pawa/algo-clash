class Solution {
public:
    ListNode* forkPoint(ListNode* a, ListNode* b) {
        unordered_set<const ListNode*> seen;
        for (ListNode* n = a; n != nullptr; n = n->next) seen.insert(n);
        for (ListNode* n = b; n != nullptr; n = n->next) {
            if (seen.count(n)) return n;
        }
        return nullptr;
    }
};
