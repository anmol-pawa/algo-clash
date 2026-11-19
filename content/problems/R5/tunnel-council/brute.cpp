class Solution {
public:
    ListNode* mergeTunnels(vector<ListNode*>& tunnels) {
        vector<int> values;
        for (ListNode* head : tunnels)
            for (ListNode* n = head; n != nullptr; n = n->next) values.push_back(n->val);
        sort(values.begin(), values.end());
        ListNode* head = nullptr;
        for (int i = static_cast<int>(values.size()) - 1; i >= 0; --i) head = new ListNode(values[i], head);
        return head;
    }
};
