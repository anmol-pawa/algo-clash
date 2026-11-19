class Solution {
public:
    ListNode* mergeTunnels(vector<ListNode*>& tunnels) {
        struct Later {
            bool operator()(const ListNode* a, const ListNode* b) const { return a->val > b->val; }
        };
        priority_queue<ListNode*, vector<ListNode*>, Later> fronts;
        // Wrong: pushes empty tunnels too, so the comparator dereferences nullptr.
        for (ListNode* head : tunnels) fronts.push(head);
        ListNode anchor;
        ListNode* tail = &anchor;
        while (!fronts.empty()) {
            ListNode* node = fronts.top();
            fronts.pop();
            if (node == nullptr) continue;
            tail->next = node;
            tail = node;
            if (node->next != nullptr) fronts.push(node->next);
        }
        return anchor.next;
    }
};
