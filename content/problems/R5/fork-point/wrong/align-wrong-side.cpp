class Solution {
public:
    ListNode* forkPoint(ListNode* a, ListNode* b) {
        // Wrong: equalises the lengths by skipping nodes of the SHORTER list instead of the longer one.
        int la = 0, lb = 0;
        for (ListNode* n = a; n != nullptr; n = n->next) ++la;
        for (ListNode* n = b; n != nullptr; n = n->next) ++lb;
        ListNode* p = a;
        ListNode* q = b;
        for (; la < lb; ++la) { if (p) p = p->next; }
        for (; lb < la; ++lb) { if (q) q = q->next; }
        while (p != q && p != nullptr && q != nullptr) { p = p->next; q = q->next; }
        return p == q ? p : nullptr;
    }
};
