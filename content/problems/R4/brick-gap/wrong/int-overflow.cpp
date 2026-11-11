class Solution {
public:
    int fewestCrossed(vector<vector<int>> rows) {
        unordered_map<int, int> edges;
        int best = 0;
        for (const auto& row : rows) {
            int pos = 0;  // Wrong: prefix sums overflow int for wide walls.
            for (size_t j = 0; j + 1 < row.size(); ++j) {
                pos = static_cast<int>(static_cast<unsigned>(pos) + static_cast<unsigned>(row[j]));
                best = max(best, ++edges[pos]);
            }
        }
        return static_cast<int>(rows.size()) - best;
    }
};
