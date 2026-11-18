class Solution {
public:
    ListNode* sortChain(ListNode* head) {
        if (head == nullptr || head->next == nullptr) return head;
        ListNode* slow = head;
        ListNode* fast = head->next;
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode* second = slow->next;
        slow->next = nullptr;
        return merge(sortChain(head), sortChain(second));
    }
private:
    static ListNode* merge(ListNode* a, ListNode* b) {
        // Wrong: the run left over when one side is exhausted is never attached.
        ListNode anchor(0, nullptr);
        ListNode* tail = &anchor;
        while (a != nullptr && b != nullptr) {
            if (b->val < a->val) { tail->next = b; b = b->next; }
            else { tail->next = a; a = a->next; }
            tail = tail->next;
        }
        tail->next = nullptr;
        return anchor.next;
    }
};
