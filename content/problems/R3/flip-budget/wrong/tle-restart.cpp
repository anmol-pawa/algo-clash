class Solution {
public:
    int longestAfterFlips(vector<int> lamps, int budget) {
        // Correct but quadratic: extend from every start until the budget is exceeded.
        const int n = static_cast<int>(lamps.size());
        int best = 0;
        for (int i = 0; i < n; ++i) {
            int zeros = 0;
            for (int j = i; j < n; ++j) {
                zeros += (lamps[j] == 0);
                if (zeros > budget) break;
                best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
