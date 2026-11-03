class Solution {
public:
    vector<vector<int>> transposeGrid(const vector<vector<int>>& grid) {
        // Wrong: allocates rows x cols and reads the input flat, so values land in the wrong cells.
        const size_t rows = grid.size(), cols = grid[0].size();
        vector<int> flat;
        for (const auto& row : grid) for (const int v : row) flat.push_back(v);
        vector<vector<int>> out(rows, vector<int>(cols));
        for (size_t k = 0; k < flat.size(); ++k) out[k % rows][k / rows] = flat[k];
        return out;
    }
};
