class Solution {
public:
    long long largestHall(vector<int>& heights) {
        // Correct but quadratic: expand around every wall.
        const int n = static_cast<int>(heights.size());
        long long best = 0;
        for (int i = 0; i < n; ++i) {
            int l = i, r = i;
            while (l > 0 && heights[l - 1] >= heights[i]) --l;
            while (r + 1 < n && heights[r + 1] >= heights[i]) ++r;
            best = max(best, static_cast<long long>(heights[i]) * (r - l + 1));
        }
        return best;
    }
};
