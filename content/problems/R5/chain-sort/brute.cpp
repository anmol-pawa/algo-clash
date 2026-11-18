class Solution {
public:
    ListNode* sortChain(ListNode* head) {
        vector<int> values;
        for (ListNode* p = head; p != nullptr; p = p->next) values.push_back(p->val);
        sort(values.begin(), values.end());
        ListNode* result = nullptr;
        for (int i = static_cast<int>(values.size()) - 1; i >= 0; --i) result = new ListNode(values[i], result);
        return result;
    }
};
