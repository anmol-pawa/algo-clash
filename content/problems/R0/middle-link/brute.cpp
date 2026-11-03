class Solution {
public:
    ListNode* middleLink(ListNode* head) {
        // Collect every node pointer, then index.
        vector<ListNode*> nodes;
        for (ListNode* cur = head; cur != nullptr; cur = cur->next) nodes.push_back(cur);
        if (nodes.empty()) return nullptr;
        return nodes[nodes.size() / 2];
    }
};
