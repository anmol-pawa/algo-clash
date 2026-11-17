class Solution {
public:
    vector<vector<int>> spinClockwise(const vector<vector<int>>& grid) {
        // Wrong: a transpose is a mirror, not a quarter-turn; the rows are not reversed.
        vector<vector<int>> out;
        if (grid.empty()) return out;
        for (size_t j = 0; j < grid[0].size(); ++j) {
            vector<int> row;
            for (size_t i = 0; i < grid.size(); ++i) row.push_back(grid[i][j]);
            out.push_back(row);
        }
        return out;
    }
};
