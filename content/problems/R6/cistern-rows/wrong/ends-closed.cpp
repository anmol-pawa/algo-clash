class Solution {
public:
    long long cisternVolume(const vector<int>& ridge) {
        const int n = static_cast<int>(ridge.size());
        if (n == 0) return 0;
        // Bug: treats the right end as a wall by also measuring against the running left maximum only.
        long long total = 0;
        int leftBest = 0;
        for (int i = 0; i < n; ++i) {
            leftBest = max(leftBest, ridge[i]);
            total += leftBest - ridge[i];
        }
        return total;
    }
};
