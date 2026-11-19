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
        vector<ListNode*> round = tunnels;
        while (round.size() > 1) {
            vector<ListNode*> next;
            // Wrong: with an odd count the last tunnel is never carried into the next round.
            for (size_t i = 0; i + 1 < round.size(); i += 2) next.push_back(zip(round[i], round[i + 1]));
            round = next;
        }
        return round.empty() ? nullptr : round[0];
    }
};
