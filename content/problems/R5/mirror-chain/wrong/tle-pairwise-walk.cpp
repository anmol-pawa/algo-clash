class Solution {
public:
    bool isMirror(ListNode* head) {
        int n = 0;
        for (ListNode* p = head; p != nullptr; p = p->next) ++n;
        // Correct but quadratic: every pair is found by walking from the head again.
        for (int i = 0; i < n / 2; ++i) {
            ListNode* a = head;
            for (int s = 0; s < i; ++s) a = a->next;
            ListNode* b = head;
            for (int s = 0; s < n - 1 - i; ++s) b = b->next;
            if (a->val != b->val) return false;
        }
        return true;
    }
};
