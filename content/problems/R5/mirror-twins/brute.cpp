class Solution {
public:
    Node* copyChain(Node* head) {
        // Index every node by scanning (quadratic, but obviously correct), then rebuild.
        vector<Node*> orig;
        for (Node* p = head; p != nullptr; p = p->next) orig.push_back(p);
        vector<Node*> twin;
        for (Node* p : orig) twin.push_back(new Node(p->val));
        for (size_t i = 0; i < orig.size(); ++i) {
            if (i + 1 < orig.size()) twin[i]->next = twin[i + 1];
            if (orig[i]->random != nullptr) {
                for (size_t j = 0; j < orig.size(); ++j) {
                    if (orig[j] == orig[i]->random) { twin[i]->random = twin[j]; break; }
                }
            }
        }
        return twin.empty() ? nullptr : twin[0];
    }
};
