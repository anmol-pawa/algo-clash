class Solution {
public:
    Node* copyChain(Node* head) {
        // Wrong: copies the shortcut pointer as is, so twins point back into the original chain.
        Node dummy(0);
        Node* tail = &dummy;
        for (Node* p = head; p != nullptr; p = p->next) {
            tail->next = new Node(p->val);
            tail = tail->next;
            tail->random = p->random;
        }
        return dummy.next;
    }
};
