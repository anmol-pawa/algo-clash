class Solution {
public:
    vector<vector<int>> transposeGrid(const vector<vector<int>>& grid) {
        const size_t rows = grid.size();
        const size_t cols = grid[0].size();
        // The answer has the shape cols x rows: swap the two sizes when you build it.
        vector<vector<int>> turned(cols, vector<int>(rows));
        for (size_t i = 0; i < rows; ++i) {
            for (size_t j = 0; j < cols; ++j) {
                turned[j][i] = grid[i][j];
            }
        }
        return turned;
    }
};
