class Solution {
public:
    ListNode* snipFromEnd(ListNode* head, int n) {
        vector<int> values;
        for (ListNode* p = head; p != nullptr; p = p->next) values.push_back(p->val);
        values.erase(values.begin() + (static_cast<int>(values.size()) - n));
        ListNode* result = nullptr;
        for (int i = static_cast<int>(values.size()) - 1; i >= 0; --i) result = new ListNode(values[i], result);
        return result;
    }
};
