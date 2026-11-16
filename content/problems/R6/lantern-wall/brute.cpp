class Solution {
public:
    int brightestPane(const vector<string>& wall) {
        const int rows = static_cast<int>(wall.size());
        const int cols = static_cast<int>(wall[0].size());
        // run[r][c] = lit panes in a row ending at (r, c)
        vector<vector<int>> run(rows, vector<int>(cols, 0));
        for (int r = 0; r < rows; ++r)
            for (int c = 0; c < cols; ++c) run[r][c] = (wall[r][c] == '1') ? (c ? run[r][c - 1] : 0) + 1 : 0;
        int best = 0;
        for (int r = 0; r < rows; ++r)
            for (int c = 0; c < cols; ++c) {
                int width = INT_MAX;
                for (int k = r; k >= 0 && run[k][c] > 0; --k) {
                    width = min(width, run[k][c]);
                    best = max(best, width * (r - k + 1));
                }
            }
        return best;
    }
};
