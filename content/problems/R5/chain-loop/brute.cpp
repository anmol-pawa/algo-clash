class Solution {
public:
    bool chainLoop(ListNode* head) {
        unordered_set<const ListNode*> seen;
        for (const ListNode* n = head; n != nullptr; n = n->next) {
            if (!seen.insert(n).second) return true;
        }
        return false;
    }
};
