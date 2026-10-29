class Solution {
public:
    long long largestHall(vector<int>& heights) {
        const int n = static_cast<int>(heights.size());
        vector<int> stack;
        int best = 0;  // Wrong: 32-bit area overflows.
        for (int i = 0; i <= n; ++i) {
            const int cur = (i == n) ? 0 : heights[i];
            while (!stack.empty() && heights[stack.back()] > cur) {
                const int h = heights[stack.back()];
                stack.pop_back();
                const int left = stack.empty() ? -1 : stack.back();
                best = max(best, h * (i - left - 1));
            }
            stack.push_back(i);
        }
        return best;
    }
};
