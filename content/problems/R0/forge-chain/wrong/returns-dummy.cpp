class Solution {
public:
    ListNode* forgeChain(vector<int> values) {
        // Wrong: returns the dummy itself, so the answer has a leading 0 (and a dangling pointer).
        ListNode dummy(0);
        ListNode* tail = &dummy;
        for (const int value : values) {
            tail->next = new ListNode(value);
            tail = tail->next;
        }
        return new ListNode(0, dummy.next);
    }
};
