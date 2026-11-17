class Solution {
public:
    bool isMirror(ListNode* head) {
        vector<long long> values;
        for (ListNode* p = head; p != nullptr; p = p->next) values.push_back(p->val);
        // Wrong: equal sums of the two halves do not mean the order is mirrored.
        long long front = 0, back = 0;
        const int n = static_cast<int>(values.size());
        for (int i = 0; i < n / 2; ++i) {
            front += values[i];
            back += values[n - 1 - i];
        }
        return front == back;
    }
};
