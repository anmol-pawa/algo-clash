class Solution {
public:
    ListNode* midLink(ListNode* head) {
        int length = 0;
        for (ListNode* n = head; n != nullptr; n = n->next) ++length;
        ListNode* node = head;
        for (int i = 0; i < length / 2; ++i) node = node->next;
        return node;
    }
};
