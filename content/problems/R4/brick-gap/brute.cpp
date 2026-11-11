class Solution {
public:
    int fewestCrossed(vector<vector<int>> rows) {
        // Try every interior boundary that exists in any row, and test each row directly.
        set<long long> candidates;
        for (const auto& row : rows) {
            long long pos = 0;
            for (size_t j = 0; j + 1 < row.size(); ++j) {
                pos += row[j];
                candidates.insert(pos);
            }
        }
        int fewest = static_cast<int>(rows.size());
        for (const long long x : candidates) {
            int crossed = 0;
            for (const auto& row : rows) {
                long long pos = 0;
                bool onEdge = false;
                for (const int w : row) {
                    pos += w;
                    if (pos == x) onEdge = true;
                }
                if (!onEdge) ++crossed;
            }
            fewest = min(fewest, crossed);
        }
        return fewest;
    }
};
