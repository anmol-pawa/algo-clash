class Solution {
public:
    int longestAfterFlips(vector<int> lamps, int budget) {
        int zeros = 0;  // off lamps inside the window [left, right]
        int left = 0;
        int best = 0;
        for (int right = 0; right < static_cast<int>(lamps.size()); ++right) {
            if (lamps[right] == 0) ++zeros;
            while (zeros > budget) {  // cannot afford this many flips: drop from the left
                if (lamps[left] == 0) --zeros;
                ++left;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};
