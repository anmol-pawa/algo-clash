class Solution {
public:
    vector<vector<int>> transposeGrid(const vector<vector<int>>& grid) {
        // Wrong: assumes a square grid and pads the answer to n x n.
        const size_t n = max(grid.size(), grid[0].size());
        vector<vector<int>> out(n, vector<int>(n, 0));
        for (size_t i = 0; i < grid.size(); ++i)
            for (size_t j = 0; j < grid[0].size(); ++j) out[j][i] = grid[i][j];
        return out;
    }
};
