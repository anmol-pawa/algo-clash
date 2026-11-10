class Solution {
public:
    long long bestRingStretch(vector<int> gains) {
        int total = gains[0], maxEnd = gains[0], maxBest = gains[0], minEnd = gains[0], minBest = gains[0];  // Wrong: int overflows at 10^14.
        for (size_t i = 1; i < gains.size(); ++i) {
            const int g = gains[i];
            total += g;
            maxEnd = max(g, maxEnd + g);
            maxBest = max(maxBest, maxEnd);
            minEnd = min(g, minEnd + g);
            minBest = min(minBest, minEnd);
        }
        if (maxBest < 0) return maxBest;
        return max(maxBest, total - minBest);
    }
};
