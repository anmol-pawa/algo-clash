class Solution {
public:
    long long poolVolume(vector<int> heights) {
        const int n = static_cast<int>(heights.size());
        long long water = 0;
        for (int i = 0; i < n; ++i) {
            int leftMax = 0, rightMax = 0;
            for (int j = 0; j <= i; ++j) leftMax = max(leftMax, heights[j]);
            for (int j = i; j < n; ++j) rightMax = max(rightMax, heights[j]);
            water += min(leftMax, rightMax) - heights[i];
        }
        return water;
    }
};
