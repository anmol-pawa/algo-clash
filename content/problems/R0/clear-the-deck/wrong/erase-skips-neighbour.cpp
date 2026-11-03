class Solution {
public:
    vector<int> dropAll(vector<int> deck, int target) {
        // Wrong: after erase(i) the next card slides into slot i, but the loop moves on to i + 1.
        for (size_t i = 0; i < deck.size(); ++i) {
            if (deck[i] == target) deck.erase(deck.begin() + static_cast<long>(i));
        }
        return deck;
    }
};
