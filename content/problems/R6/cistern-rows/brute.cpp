class Solution {
public:
    long long cisternVolume(const vector<int>& ridge) {
        const int n = static_cast<int>(ridge.size());
        long long total = 0;
        for (int i = 0; i < n; ++i) {
            int leftBest = 0, rightBest = 0;
            for (int j = 0; j <= i; ++j) leftBest = max(leftBest, ridge[j]);
            for (int j = i; j < n; ++j) rightBest = max(rightBest, ridge[j]);
            total += min(leftBest, rightBest) - ridge[i];
        }
        return total;
    }
};
