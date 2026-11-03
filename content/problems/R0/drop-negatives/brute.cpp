class Solution {
public:
    ListNode* dropNegatives(ListNode* head) {
        // Rebuild: copy survivors into a vector, then allocate a fresh list.
        vector<int> keep;
        for (ListNode* cur = head; cur != nullptr; cur = cur->next) {
            if (cur->val >= 0) keep.push_back(cur->val);
        }
        ListNode* out = nullptr;
        for (size_t i = keep.size(); i-- > 0;) out = new ListNode(keep[i], out);
        return out;
    }
};
