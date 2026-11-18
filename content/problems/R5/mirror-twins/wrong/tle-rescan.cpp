class Solution {
public:
    Node* copyChain(Node* head) {
        // Correct but quadratic: finds each shortcut target by walking from the head again.
        Node dummy(0);
        Node* tail = &dummy;
        vector<Node*> twins;
        for (Node* p = head; p != nullptr; p = p->next) {
            tail->next = new Node(p->val);
            tail = tail->next;
            twins.push_back(tail);
        }
        size_t i = 0;
        for (Node* p = head; p != nullptr; p = p->next, ++i) {
            if (p->random == nullptr) continue;
            size_t j = 0;
            Node* q = head;
            while (q != p->random) { q = q->next; ++j; }
            twins[i]->random = twins[j];
        }
        return dummy.next;
    }
};
