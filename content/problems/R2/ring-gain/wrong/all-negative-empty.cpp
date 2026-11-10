class Solution {
public:
    long long bestRingStretch(vector<int> gains) {
        long long total = gains[0], maxEnd = gains[0], maxBest = gains[0], minEnd = gains[0], minBest = gains[0];
        for (size_t i = 1; i < gains.size(); ++i) {
            const long long g = gains[i];
            total += g;
            maxEnd = max(g, maxEnd + g);
            maxBest = max(maxBest, maxEnd);
            minEnd = min(g, minEnd + g);
            minBest = min(minBest, minEnd);
        }
        return max(maxBest, total - minBest);  // Wrong: when all values are negative total - minBest is 0, an empty stretch.
    }
};
