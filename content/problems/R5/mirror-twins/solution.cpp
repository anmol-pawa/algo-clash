class Solution {
public:
    Node* copyChain(Node* head) {
        if (head == nullptr) return nullptr;
        // Pass 1: weave a twin right after every original: a -> a' -> b -> b' ...
        for (Node* cur = head; cur != nullptr; cur = cur->next->next) {
            Node* twin = new Node(cur->val);
            twin->next = cur->next;
            cur->next = twin;
        }
        // Pass 2: the twin of cur->random is exactly cur->random->next.
        for (Node* cur = head; cur != nullptr; cur = cur->next->next) {
            if (cur->random != nullptr) cur->next->random = cur->random->next;
        }
        // Pass 3: unzip the two chains, restoring the original.
        Node* newHead = head->next;
        for (Node* cur = head; cur != nullptr; cur = cur->next) {
            Node* twin = cur->next;
            cur->next = twin->next;
            if (twin->next != nullptr) twin->next = twin->next->next;
        }
        return newHead;
    }
};
