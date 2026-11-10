class Solution {
public:
    long long bestRingStretch(vector<int> gains) {
        // Either the best stretch does not wrap (plain Kadane), or it wraps and equals
        // total minus the worst non-wrapping stretch in the middle.
        long long total = gains[0];
        long long maxEnd = gains[0], maxBest = gains[0];
        long long minEnd = gains[0], minBest = gains[0];
        for (size_t i = 1; i < gains.size(); ++i) {
            const long long g = gains[i];
            total += g;
            maxEnd = max(g, maxEnd + g);
            maxBest = max(maxBest, maxEnd);
            minEnd = min(g, minEnd + g);
            minBest = min(minBest, minEnd);
        }
        // If every element is negative the "wrap" option would remove everything (empty stretch): not allowed.
        if (maxBest < 0) return maxBest;
        return max(maxBest, total - minBest);
    }
};
