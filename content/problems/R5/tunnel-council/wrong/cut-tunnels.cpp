class Solution {
public:
    ListNode* mergeTunnels(vector<ListNode*>& tunnels) {
        auto cmp = [](const ListNode* a, const ListNode* b) { return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> fronts(cmp);
        for (ListNode* head : tunnels) if (head != nullptr) fronts.push(head);
        ListNode anchor;
        ListNode* tail = &anchor;
        // Wrong: never pushes node->next, so only the first node of each tunnel is merged;
        // the rest of every tunnel is silently dropped.
        while (!fronts.empty()) {
            ListNode* node = fronts.top();
            fronts.pop();
            tail->next = node;
            tail = node;
        }
        tail->next = nullptr;
        return anchor.next;
    }
};
