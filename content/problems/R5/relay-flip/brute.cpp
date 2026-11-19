class Solution {
public:
    ListNode* flipRelays(ListNode* head, int k) {
        vector<int> values;
        for (ListNode* n = head; n != nullptr; n = n->next) values.push_back(n->val);
        for (size_t start = 0; start + static_cast<size_t>(k) <= values.size(); start += static_cast<size_t>(k))
            reverse(values.begin() + static_cast<long>(start), values.begin() + static_cast<long>(start) + k);
        ListNode* out = nullptr;
        for (int i = static_cast<int>(values.size()) - 1; i >= 0; --i) out = new ListNode(values[i], out);
        return out;
    }
};
