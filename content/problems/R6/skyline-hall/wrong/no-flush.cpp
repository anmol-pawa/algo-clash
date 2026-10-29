class Solution {
public:
    long long largestHall(vector<int>& heights) {
        const int n = static_cast<int>(heights.size());
        vector<int> stack;
        long long best = 0;
        for (int i = 0; i < n; ++i) {  // Wrong: no sentinel, walls left on the stack are never measured.
            while (!stack.empty() && heights[stack.back()] > heights[i]) {
                const long long h = heights[stack.back()];
                stack.pop_back();
                const int left = stack.empty() ? -1 : stack.back();
                best = max(best, h * (i - left - 1));
            }
            stack.push_back(i);
        }
        return best;
    }
};
