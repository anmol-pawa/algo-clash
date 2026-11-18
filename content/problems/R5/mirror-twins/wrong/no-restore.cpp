class Solution {
public:
    Node* copyChain(Node* head) {
        if (head == nullptr) return nullptr;
        for (Node* cur = head; cur != nullptr; cur = cur->next->next) {
            Node* twin = new Node(cur->val);
            twin->next = cur->next;
            cur->next = twin;
        }
        for (Node* cur = head; cur != nullptr; cur = cur->next->next) {
            if (cur->random != nullptr) cur->next->random = cur->random->next;
        }
        // Wrong: returns the twin chain but never unzips, so the original keeps the twins woven in.
        Node* newHead = head->next;
        for (Node* cur = newHead; cur != nullptr && cur->next != nullptr; cur = cur->next) {
            cur->next = cur->next->next;
        }
        return newHead;
    }
};
