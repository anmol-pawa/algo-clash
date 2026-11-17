class Solution {
public:
    ListNode* flipChain(ListNode* head) {
        vector<int> values;
        for (ListNode* n = head; n != nullptr; n = n->next) values.push_back(n->val);
        reverse(values.begin(), values.end());
        int i = 0;
        for (ListNode* n = head; n != nullptr; n = n->next) n->val = values[i++];
        return head;
    }
};
