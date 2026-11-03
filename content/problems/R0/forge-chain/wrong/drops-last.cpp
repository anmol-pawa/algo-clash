class Solution {
public:
    ListNode* forgeChain(vector<int> values) {
        // Wrong: the loop bound stops one element early.
        ListNode dummy(0);
        ListNode* tail = &dummy;
        for (size_t i = 0; i + 1 < values.size(); ++i) {
            tail->next = new ListNode(values[i]);
            tail = tail->next;
        }
        return dummy.next;
    }
};
