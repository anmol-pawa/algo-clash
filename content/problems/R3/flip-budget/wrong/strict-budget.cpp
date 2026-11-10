class Solution {
public:
    int longestAfterFlips(vector<int> lamps, int budget) {
        int zeros = 0;
        int left = 0;
        int best = 0;
        for (int right = 0; right < static_cast<int>(lamps.size()); ++right) {
            if (lamps[right] == 0) ++zeros;
            while (zeros >= budget && left <= right && zeros > 0) {  // wrong: allows budget - 1 zeros, not budget
                if (lamps[left] == 0) --zeros;
                ++left;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};
