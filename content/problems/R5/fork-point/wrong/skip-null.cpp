class Solution {
public:
    ListNode* forkPoint(ListNode* a, ListNode* b) {
        // Wrong: jumps to the other list before stepping off the end, so the walkers never both
        // reach nullptr and disjoint lists loop forever.
        ListNode* p = a;
        ListNode* q = b;
        while (p != q) {
            p = (p != nullptr && p->next != nullptr) ? p->next : b;
            q = (q != nullptr && q->next != nullptr) ? q->next : a;
        }
        return p;
    }
};
