class Solution {
public:
    ListNode* zipMerge(ListNode* a, ListNode* b) {
        vector<int> values;
        for (ListNode* n = a; n != nullptr; n = n->next) values.push_back(n->val);
        for (ListNode* n = b; n != nullptr; n = n->next) values.push_back(n->val);
        sort(values.begin(), values.end());
        ListNode* head = nullptr;
        for (int i = static_cast<int>(values.size()) - 1; i >= 0; --i) head = new ListNode(values[i], head);
        return head;
    }
};
