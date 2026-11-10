class Solution {
public:
    int longestAfterFlips(vector<int> lamps, int budget) {
        const int n = static_cast<int>(lamps.size());
        int best = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = i; j < n; ++j) {
                int zeros = 0;
                for (int x = i; x <= j; ++x) zeros += (lamps[x] == 0);
                if (zeros <= budget) best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
