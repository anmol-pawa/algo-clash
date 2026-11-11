class Solution {
public:
    int fewestCrossed(vector<vector<int>> rows) {
        unordered_map<long long, int> edges;
        int best = 0;
        for (const auto& row : rows) {
            long long pos = 0;
            for (size_t j = 0; j + 1 < row.size(); ++j) {
                pos += row[j];
                best = max(best, ++edges[pos]);
            }
        }
        return best == 0 ? static_cast<int>(rows.size()) : best;  // Wrong: returns the edge count, not the rows crossed.
    }
};
