class Solution {
public:
    vector<vector<int>> transposeGrid(const vector<vector<int>>& grid) {
        // Build the answer one column of the input at a time with push_back.
        vector<vector<int>> turned;
        for (size_t j = 0; j < grid[0].size(); ++j) {
            vector<int> line;
            for (size_t i = 0; i < grid.size(); ++i) line.push_back(grid[i][j]);
            turned.push_back(line);
        }
        return turned;
    }
};
