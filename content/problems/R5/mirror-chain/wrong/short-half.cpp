class Solution {
public:
    bool isMirror(ListNode* head) {
        if (head == nullptr || head->next == nullptr) return true;
        ListNode* slow = head;
        ListNode* fast = head;
        // Wrong: this loop leaves slow on the middle (odd) or the second middle (even),
        // so for even lengths the reversed half is one node too short and the pair is never checked.
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode* prev = nullptr;
        for (ListNode* cur = slow->next; cur != nullptr;) {
            ListNode* following = cur->next;
            cur->next = prev;
            prev = cur;
            cur = following;
        }
        ListNode* left = head;
        for (ListNode* right = prev; right != nullptr; right = right->next, left = left->next)
            if (left->val != right->val) return false;
        return true;
    }
};
