class Solution {
public:
    ListNode* midLink(ListNode* head) {
        // Wrong: walks to the last node.
        ListNode* node = head;
        while (node != nullptr && node->next != nullptr) node = node->next;
        return node;
    }
};
