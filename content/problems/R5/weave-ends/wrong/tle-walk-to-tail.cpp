class Solution {
public:
    ListNode* weaveEnds(ListNode* head) {
        // Wrong (too slow): for every front node, walk to the current last node and splice it in.
        ListNode* front = head;
        while (front != nullptr && front->next != nullptr && front->next->next != nullptr) {
            ListNode* beforeLast = front;
            while (beforeLast->next->next != nullptr) beforeLast = beforeLast->next;
            ListNode* last = beforeLast->next;
            beforeLast->next = nullptr;
            last->next = front->next;
            front->next = last;
            front = last->next;
        }
        return head;
    }
};
