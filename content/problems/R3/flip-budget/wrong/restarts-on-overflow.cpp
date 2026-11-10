class Solution {
public:
    int longestAfterFlips(vector<int> lamps, int budget) {
        int zeros = 0;
        int left = 0;
        int best = 0;
        for (int right = 0; right < static_cast<int>(lamps.size()); ++right) {
            if (lamps[right] == 0) ++zeros;
            if (zeros > budget) {  // wrong: throws the whole window away instead of dropping only from the left
                left = right;
                zeros = lamps[right] == 0 ? 1 : 0;
                if (zeros > budget) { left = right + 1; zeros = 0; }
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};
