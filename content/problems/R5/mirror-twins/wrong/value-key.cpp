class Solution {
public:
    Node* copyChain(Node* head) {
        // Wrong: identifies a lantern by its value, so equal values collapse onto one twin.
        unordered_map<int, Node*> byVal;
        for (Node* p = head; p != nullptr; p = p->next) byVal[p->val] = new Node(p->val);
        Node dummy(0);
        Node* tail = &dummy;
        for (Node* p = head; p != nullptr; p = p->next) {
            Node* t = byVal[p->val];
            if (p->random != nullptr) t->random = byVal[p->random->val];
            tail->next = t;
            tail = t;
        }
        if (tail != &dummy) tail->next = nullptr;
        return dummy.next;
    }
};
