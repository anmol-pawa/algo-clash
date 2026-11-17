class Solution {
public:
    ListNode* loopGate(ListNode* head) {
        // Wrong (too slow): for every node, walk forward to see whether it comes back to itself.
        for (ListNode* a = head; a != nullptr; a = a->next) {
            ListNode* b = a->next;
            for (int steps = 0; b != nullptr && steps < 100001; ++steps) {
                if (b == a) return a;
                b = b->next;
            }
        }
        return nullptr;
    }
};
