class Solution {
public:
    ListNode* sortChain(ListNode* head) {
        if (head == nullptr || head->next == nullptr) return head;

        // Split: slow ends on the last node of the first half (for even n, the left middle).
        ListNode* slow = head;
        ListNode* fast = head->next;
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode* second = slow->next;
        slow->next = nullptr;  // cut, so each half is a separate list

        return merge(sortChain(head), sortChain(second));
    }

private:
    // Stable merge of two sorted lists using a dummy head.
    static ListNode* merge(ListNode* a, ListNode* b) {
        ListNode anchor(0, nullptr);
        ListNode* tail = &anchor;
        while (a != nullptr && b != nullptr) {
            if (b->val < a->val) {  // strict: ties take from a, which keeps the sort stable
                tail->next = b;
                b = b->next;
            } else {
                tail->next = a;
                a = a->next;
            }
            tail = tail->next;
        }
        tail->next = (a != nullptr) ? a : b;  // append the leftover run
        return anchor.next;
    }
};
