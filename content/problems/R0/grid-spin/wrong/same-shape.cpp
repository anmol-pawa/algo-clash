class Solution {
public:
    vector<vector<int>> spinClockwise(const vector<vector<int>>& grid) {
        // Wrong: allocates rows x cols, which only works for square grids.
        const size_t rows = grid.size();
        const size_t cols = grid.empty() ? 0 : grid[0].size();
        vector<vector<int>> out(rows, vector<int>(cols));
        for (size_t i = 0; i < rows; ++i) {
            for (size_t j = 0; j < cols; ++j) {
                if (j < rows && rows - 1 - i < cols) out[j][rows - 1 - i] = grid[i][j];
            }
        }
        return out;
    }
};
