class Solution {
public:
    ListNode* spinChain(ListNode* head, int k) {
        vector<int> values;
        for (ListNode* p = head; p != nullptr; p = p->next) values.push_back(p->val);
        const int n = static_cast<int>(values.size());
        if (n == 0) return nullptr;
        vector<int> rotated(n);
        for (int i = 0; i < n; ++i) rotated[(static_cast<long long>(i) + k) % n] = values[i];
        ListNode* result = nullptr;
        for (int i = n - 1; i >= 0; --i) result = new ListNode(rotated[i], result);
        return result;
    }
};
