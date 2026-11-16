class Solution {
public:
    int brightestPane(const vector<string>& wall) {
        // Bug: only the longest straight run of lit panes, horizontal or vertical.
        const int rows = static_cast<int>(wall.size());
        const int cols = static_cast<int>(wall[0].size());
        int best = 0;
        for (int r = 0; r < rows; ++r) {
            int run = 0;
            for (int c = 0; c < cols; ++c) best = max(best, run = (wall[r][c] == '1') ? run + 1 : 0);
        }
        for (int c = 0; c < cols; ++c) {
            int run = 0;
            for (int r = 0; r < rows; ++r) best = max(best, run = (wall[r][c] == '1') ? run + 1 : 0);
        }
        return best;
    }
};
