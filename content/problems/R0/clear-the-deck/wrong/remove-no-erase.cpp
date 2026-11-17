class Solution {
public:
    vector<int> dropAll(vector<int> deck, int target) {
        // Wrong: remove() alone leaves the size unchanged, so stale cards remain at the end.
        remove(deck.begin(), deck.end(), target);
        return deck;
    }
};
