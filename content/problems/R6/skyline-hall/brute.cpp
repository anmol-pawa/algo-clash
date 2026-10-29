class Solution {
public:
    long long largestHall(vector<int>& heights) {
        const int n = static_cast<int>(heights.size());
        long long best = 0;
        for (int i = 0; i < n; ++i) {
            int lo = heights[i];
            for (int j = i; j < n; ++j) {
                lo = min(lo, heights[j]);
                best = max(best, static_cast<long long>(lo) * (j - i + 1));
            }
        }
        return best;
    }
};
