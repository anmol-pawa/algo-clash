class Solution {
public:
    int fewestCrossed(vector<vector<int>> rows) {
        // edges[x] = how many rows have a brick boundary at distance x from the left.
        unordered_map<long long, int> edges;
        int best = 0;
        for (const auto& row : rows) {
            long long pos = 0;  // The total width can exceed int, so use long long.
            for (size_t j = 0; j + 1 < row.size(); ++j) {  // Skip the last brick: the right wall is not allowed.
                pos += row[j];
                best = max(best, ++edges[pos]);
            }
        }
        return static_cast<int>(rows.size()) - best;
    }
};
