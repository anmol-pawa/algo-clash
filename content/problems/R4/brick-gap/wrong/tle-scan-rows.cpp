class Solution {
public:
    int fewestCrossed(vector<vector<int>> rows) {
        // Correct but slow: for every candidate boundary, rebuild each row's edge set from scratch.
        vector<long long> candidates;
        for (const auto& row : rows) {
            long long pos = 0;
            for (size_t j = 0; j + 1 < row.size(); ++j) {
                pos += row[j];
                candidates.push_back(pos);
            }
        }
        int fewest = static_cast<int>(rows.size());
        for (const long long x : candidates) {
            int crossed = 0;
            for (const auto& row : rows) {
                unordered_set<long long> edges;
                long long pos = 0;
                for (const int w : row) {
                    pos += w;
                    edges.insert(pos);
                }
                if (!edges.count(x)) ++crossed;
            }
            fewest = min(fewest, crossed);
        }
        return fewest;
    }
};
