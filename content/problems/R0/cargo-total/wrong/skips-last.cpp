class Solution {
public:
    long long totalWeight(vector<int> w) {
        // Wrong: off-by-one, the last crate is never added.
        long long total = 0;
        for (size_t i = 0; i + 1 < w.size(); ++i) total += w[i];
        return total;
    }
};
