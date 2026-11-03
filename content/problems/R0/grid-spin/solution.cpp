class Solution {
public:
    vector<vector<int>> spinClockwise(const vector<vector<int>>& grid) {
        const size_t rows = grid.size();
        const size_t cols = grid.empty() ? 0 : grid[0].size();
        // The answer has the swapped shape: cols rows of length rows.
        vector<vector<int>> out(cols, vector<int>(rows));
        for (size_t i = 0; i < rows; ++i) {
            for (size_t j = 0; j < cols; ++j) {
                out[j][rows - 1 - i] = grid[i][j];  // (i, j) lands at (j, rows - 1 - i)
            }
        }
        return out;
    }
};
