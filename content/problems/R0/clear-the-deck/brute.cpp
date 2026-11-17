class Solution {
public:
    vector<int> dropAll(vector<int> deck, int target) {
        vector<int> kept;
        for (const int card : deck) {
            if (card != target) kept.push_back(card);
        }
        return kept;
    }
};
