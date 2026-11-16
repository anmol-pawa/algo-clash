class Solution {
public:
    int brightestPane(const vector<string>& wall) {
        const int rows = static_cast<int>(wall.size());
        const int cols = static_cast<int>(wall[0].size());
        vector<int> height(cols + 1, 0);
        int best = 0;
        for (int r = 0; r < rows; ++r) {
            // Bug: a dark pane does not reset the column, heights jump over holes.
            for (int c = 0; c < cols; ++c) if (wall[r][c] == '1') ++height[c];
            vector<int> stack;
            for (int i = 0; i <= cols; ++i) {
                while (!stack.empty() && height[stack.back()] > height[i]) {
                    const int h = height[stack.back()];
                    stack.pop_back();
                    const int width = stack.empty() ? i : i - stack.back() - 1;
                    best = max(best, h * width);
                }
                stack.push_back(i);
            }
        }
        return best;
    }
};
