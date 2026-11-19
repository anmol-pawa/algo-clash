class Solution {
public:
    ListNode* flipRelays(ListNode* head, int k) {
        ListNode anchor;
        anchor.next = head;
        int length = 0;
        for (ListNode* n = head; n != nullptr; n = n->next) ++length;
        // Correct but slow: every block is located by walking from the anchor again, O(n^2 / k).
        for (int done = 0; done + k <= length; done += k) {
            ListNode* groupPrev = &anchor;
            for (int i = 0; i < done; ++i) groupPrev = groupPrev->next;
            ListNode* cur = groupPrev->next;
            for (int i = 1; i < k; ++i) {  // pull the next node to the front of the block, k - 1 times
                ListNode* moved = cur->next;
                cur->next = moved->next;
                moved->next = groupPrev->next;
                groupPrev->next = moved;
            }
        }
        return anchor.next;
    }
};
