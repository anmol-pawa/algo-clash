class Solution {
public:
    ListNode* forgeChain(vector<int> values) {
        ListNode dummy(0);                       // stack node: only dummy.next escapes
        ListNode* tail = &dummy;
        for (const int value : values) {
            tail->next = new ListNode(value);    // heap node: it must outlive this function
            tail = tail->next;
        }
        return dummy.next;                       // nullptr when values is empty
    }
};
