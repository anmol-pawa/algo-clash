class Solution {
public:
    ListNode* reverseChain(ListNode* head) {
        // Copy the values out, then build a fresh reversed chain. Checker only.
        vector<int> vals;
        for (ListNode* p = head; p != nullptr; p = p->next) vals.push_back(p->val);
        ListNode* out = nullptr;
        for (int v : vals) out = new ListNode(v, out);
        return out;
    }
};
