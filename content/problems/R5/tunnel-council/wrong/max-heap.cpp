class Solution {
public:
    ListNode* mergeTunnels(vector<ListNode*>& tunnels) {
        // Wrong: default comparator is a max-heap on val, so the merged list comes out descending.
        auto cmp = [](const ListNode* a, const ListNode* b) { return a->val < b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> fronts(cmp);
        for (ListNode* head : tunnels) if (head != nullptr) fronts.push(head);
        ListNode anchor;
        ListNode* tail = &anchor;
        while (!fronts.empty()) {
            ListNode* node = fronts.top();
            fronts.pop();
            tail->next = node;
            tail = node;
            if (node->next != nullptr) fronts.push(node->next);
        }
        return anchor.next;
    }
};
