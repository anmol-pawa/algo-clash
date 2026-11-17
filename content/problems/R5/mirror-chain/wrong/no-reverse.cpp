class Solution {
public:
    bool isMirror(ListNode* head) {
        if (head == nullptr || head->next == nullptr) return true;
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast->next != nullptr && fast->next->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }
        // Wrong: the second half is compared in its original order instead of reversed.
        ListNode* left = head;
        for (ListNode* right = slow->next; right != nullptr; right = right->next, left = left->next)
            if (left->val != right->val) return false;
        return true;
    }
};
