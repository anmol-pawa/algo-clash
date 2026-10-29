class Solution {
public:
    long long largestHall(vector<int>& heights) {
        const int n = static_cast<int>(heights.size());
        vector<int> stack;
        long long best = 0;
        for (int i = 0; i <= n; ++i) {
            const long long cur = (i == n) ? 0 : heights[i];
            while (!stack.empty() && heights[stack.back()] > cur) {
                const long long h = heights[stack.back()];
                const int top = stack.back();
                stack.pop_back();
                best = max(best, h * (i - top));  // Wrong: ignores the span already merged beneath top.
            }
            stack.push_back(i);
        }
        return best;
    }
};
