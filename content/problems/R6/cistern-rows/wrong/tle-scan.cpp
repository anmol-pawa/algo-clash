class Solution {
public:
    long long cisternVolume(const vector<int>& ridge) {
        // Correct but O(n^2): re-scan both sides for every pillar.
        const int n = static_cast<int>(ridge.size());
        long long total = 0;
        for (int i = 0; i < n; ++i) {
            int leftBest = ridge[i], rightBest = ridge[i];
            for (int j = i - 1; j >= 0; --j) leftBest = max(leftBest, ridge[j]);
            for (int j = i + 1; j < n; ++j) rightBest = max(rightBest, ridge[j]);
            total += min(leftBest, rightBest) - ridge[i];
        }
        return total;
    }
};
