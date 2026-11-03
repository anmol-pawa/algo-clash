class Solution {
public:
    ListNode* forgeChain(vector<int> values) {
        // Build from the back: each new node points at the list built so far.
        ListNode* head = nullptr;
        for (size_t i = values.size(); i-- > 0;) head = new ListNode(values[i], head);
        return head;
    }
};
