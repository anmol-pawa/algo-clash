class Solution {
public:
    long long largestHall(vector<int>& heights) {
        const int n = static_cast<int>(heights.size());
        vector<int> stack;  // indices with non-decreasing heights
        long long best = 0;
        for (int i = 0; i <= n; ++i) {
            const long long cur = (i == n) ? 0 : heights[i];  // height 0 sentinel flushes the stack
            while (!stack.empty() && heights[stack.back()] > cur) {
                const long long h = heights[stack.back()];
                stack.pop_back();
                const int left = stack.empty() ? -1 : stack.back();  // nearest shorter-or-equal on the left
                best = max(best, h * (i - left - 1));
            }
            stack.push_back(i);
        }
        return best;
    }
};
