class Solution {
public:
    bool isMirror(ListNode* head) {
        vector<int> values;
        for (ListNode* p = head; p != nullptr; p = p->next) values.push_back(p->val);
        vector<int> backwards(values.rbegin(), values.rend());
        return values == backwards;
    }
};
