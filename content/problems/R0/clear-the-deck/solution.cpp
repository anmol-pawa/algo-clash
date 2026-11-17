class Solution {
public:
    vector<int> dropAll(vector<int> deck, int target) {
        // remove() compacts the kept cards to the front; erase() cuts the leftover tail once.
        deck.erase(remove(deck.begin(), deck.end(), target), deck.end());
        return deck;
    }
};
