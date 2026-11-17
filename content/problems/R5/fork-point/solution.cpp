class Solution {
public:
    ListNode* forkPoint(ListNode* a, ListNode* b) {
        // Each walker traverses its own list and then the other one, so both cover
        // len(a) + len(b) nodes in total and the fork (or the final nullptr) lines up.
        ListNode* p = a;
        ListNode* q = b;
        while (p != q) {
            p = (p != nullptr) ? p->next : b;
            q = (q != nullptr) ? q->next : a;
        }
        return p;  // the shared node, or nullptr if the lists never meet
    }
};
