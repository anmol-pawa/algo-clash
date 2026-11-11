class Solution {
public:
    int fewestCrossed(vector<vector<int>> rows) {
        unordered_map<long long, int> edges;
        int best = 0;
        for (const auto& row : rows) {
            long long pos = 0;
            for (const int w : row) {  // Wrong: also counts the right wall, so a single column "needs" 0 crossings.
                pos += w;
                best = max(best, ++edges[pos]);
            }
        }
        return static_cast<int>(rows.size()) - best;
    }
};
