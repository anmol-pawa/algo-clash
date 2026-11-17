class Solution {
public:
    vector<vector<int>> spinClockwise(const vector<vector<int>>& grid) {
        // Transpose, then reverse every row.
        vector<vector<int>> out;
        if (grid.empty()) return out;
        for (size_t j = 0; j < grid[0].size(); ++j) {
            vector<int> row;
            for (size_t i = 0; i < grid.size(); ++i) row.push_back(grid[i][j]);
            reverse(row.begin(), row.end());
            out.push_back(row);
        }
        return out;
    }
};
