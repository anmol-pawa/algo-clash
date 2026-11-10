class Solution {
public:
    long long bestBasin(vector<int> heights) {
        const int n = static_cast<int>(heights.size());
        long long best = 0;
        for (int i = 0; i < n; ++i)
            for (int j = i + 1; j < n; ++j)
                best = max(best, static_cast<long long>(j - i) * min(heights[i], heights[j]));
        return best;
    }
};
