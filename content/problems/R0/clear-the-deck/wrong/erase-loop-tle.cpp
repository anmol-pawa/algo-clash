class Solution {
public:
    vector<int> dropAll(vector<int> deck, int target) {
        // Correct but O(n * k): every erase shifts the whole tail.
        size_t i = 0;
        while (i < deck.size()) {
            if (deck[i] == target) deck.erase(deck.begin() + static_cast<long>(i));
            else ++i;
        }
        return deck;
    }
};
