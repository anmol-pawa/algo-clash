class Solution {
public:
    ListNode* parityRails(ListNode* head) {
        vector<int> odd, even;
        int position = 1;
        for (ListNode* p = head; p != nullptr; p = p->next, ++position) (position % 2 == 1 ? odd : even).push_back(p->val);
        odd.insert(odd.end(), even.begin(), even.end());
        ListNode* result = nullptr;
        for (int i = static_cast<int>(odd.size()) - 1; i >= 0; --i) result = new ListNode(odd[i], result);
        return result;
    }
};
