class Solution {
public:
    ListNode* weaveEnds(ListNode* head) {
        vector<int> values;
        for (ListNode* p = head; p != nullptr; p = p->next) values.push_back(p->val);
        vector<int> order;
        int lo = 0, hi = static_cast<int>(values.size()) - 1;
        while (lo <= hi) {
            order.push_back(values[lo++]);
            if (lo <= hi) order.push_back(values[hi--]);
        }
        ListNode* result = nullptr;
        for (int i = static_cast<int>(order.size()) - 1; i >= 0; --i) result = new ListNode(order[i], result);
        return result;
    }
};
