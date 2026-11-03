class Solution {
public:
    ListNode* forgeChain(vector<int> values) {
        // Wrong: prepends each value, so the list comes out reversed.
        ListNode* head = nullptr;
        for (const int value : values) head = new ListNode(value, head);
        return head;
    }
};
