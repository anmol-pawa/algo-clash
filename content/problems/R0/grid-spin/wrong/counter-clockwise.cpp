class Solution {
public:
    vector<vector<int>> spinClockwise(const vector<vector<int>>& grid) {
        // Wrong: turns the floor the other way.
        const size_t rows = grid.size();
        const size_t cols = grid.empty() ? 0 : grid[0].size();
        vector<vector<int>> out(cols, vector<int>(rows));
        for (size_t i = 0; i < rows; ++i) {
            for (size_t j = 0; j < cols; ++j) out[cols - 1 - j][i] = grid[i][j];
        }
        return out;
    }
};
