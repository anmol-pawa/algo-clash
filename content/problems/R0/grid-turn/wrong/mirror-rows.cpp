class Solution {
public:
    vector<vector<int>> transposeGrid(const vector<vector<int>>& grid) {
        // Wrong: reverses each row instead of swapping rows and columns.
        vector<vector<int>> out = grid;
        for (auto& row : out) reverse(row.begin(), row.end());
        return out;
    }
};
