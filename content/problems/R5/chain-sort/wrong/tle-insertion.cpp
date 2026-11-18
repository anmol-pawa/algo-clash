class Solution {
public:
    ListNode* sortChain(ListNode* head) {
        // Wrong (too slow): insertion sort, walking the sorted part from its head every time. O(n^2).
        ListNode anchor(0, nullptr);
        while (head != nullptr) {
            ListNode* next = head->next;
            ListNode* prev = &anchor;
            while (prev->next != nullptr && prev->next->val < head->val) prev = prev->next;
            head->next = prev->next;
            prev->next = head;
            head = next;
        }
        return anchor.next;
    }
};
