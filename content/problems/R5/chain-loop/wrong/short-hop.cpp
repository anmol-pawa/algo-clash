class Solution {
public:
    bool chainLoop(ListNode* head) {
        // Wrong: gives up after a fixed number of hops, so a long tail before the loop is missed.
        ListNode* node = head;
        for (int i = 0; i < 1000 && node != nullptr; ++i) node = node->next;
        return node != nullptr;
    }
};
