class Solution {
public:
    bool isMirror(ListNode* head) {
        if (head == nullptr || head->next == nullptr) return true;

        // 1. Find the last node of the first half (the middle node of an odd list stays in the first half).
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast->next != nullptr && fast->next->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }

        // 2. Reverse the second half in place.
        ListNode* secondHalf = reverse(slow->next);

        // 3. Compare until the (never longer) second half runs out.
        bool mirror = true;
        ListNode* left = head;
        for (ListNode* right = secondHalf; right != nullptr; right = right->next, left = left->next) {
            if (left->val != right->val) {
                mirror = false;
                break;
            }
        }

        // 4. Put the list back the way it was found.
        slow->next = reverse(secondHalf);
        return mirror;
    }

private:
    static ListNode* reverse(ListNode* head) {
        ListNode* prev = nullptr;
        while (head != nullptr) {
            ListNode* following = head->next;
            head->next = prev;
            prev = head;
            head = following;
        }
        return prev;
    }
};
