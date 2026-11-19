class Solution {
public:
    ListNode* mergeTunnels(vector<ListNode*>& tunnels) {
        auto zip = [](ListNode* a, ListNode* b) {
            ListNode anchor;
            ListNode* tail = &anchor;
            while (a != nullptr && b != nullptr) {
                if (b->val < a->val) { tail->next = b; b = b->next; }
                else { tail->next = a; a = a->next; }
                tail = tail->next;
            }
            tail->next = (a != nullptr) ? a : b;
            return anchor.next;
        };
        // Correct but slow: folds every tunnel into one growing accumulator, O(k * N) node visits.
        ListNode* acc = nullptr;
        for (ListNode* head : tunnels) acc = zip(acc, head);
        return acc;
    }
};
