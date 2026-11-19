class Solution {
public:
    ListNode* mergeTunnels(vector<ListNode*>& tunnels) {
        // priority_queue is a max-heap by default, so "greater" puts the smallest value on top.
        struct Later {
            bool operator()(const ListNode* a, const ListNode* b) const { return a->val > b->val; }
        };
        priority_queue<ListNode*, vector<ListNode*>, Later> fronts;  // invariant: one front per non-empty tunnel
        for (ListNode* head : tunnels) {
            if (head != nullptr) fronts.push(head);  // empty tunnels are legal: never push null
        }
        ListNode anchor;  // dummy head so the first link needs no special case
        ListNode* tail = &anchor;
        while (!fronts.empty()) {
            ListNode* node = fronts.top();
            fronts.pop();
            tail->next = node;
            tail = node;
            if (node->next != nullptr) fronts.push(node->next);  // the next candidate from the same tunnel
        }
        return anchor.next;
    }
};
