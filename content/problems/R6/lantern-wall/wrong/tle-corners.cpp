class Solution {
public:
    int brightestPane(const vector<string>& wall) {
        // Correct but O(rows^2 * cols^2): try every pair of corners, check with prefix sums.
        const int rows = static_cast<int>(wall.size());
        const int cols = static_cast<int>(wall[0].size());
        vector<vector<int>> sum(rows + 1, vector<int>(cols + 1, 0));
        for (int r = 0; r < rows; ++r)
            for (int c = 0; c < cols; ++c) sum[r + 1][c + 1] = sum[r][c + 1] + sum[r + 1][c] - sum[r][c] + (wall[r][c] == '1');
        int best = 0;
        for (int r1 = 0; r1 < rows; ++r1)
            for (int r2 = r1; r2 < rows; ++r2)
                for (int c1 = 0; c1 < cols; ++c1)
                    for (int c2 = c1; c2 < cols; ++c2) {
                        const int area = (r2 - r1 + 1) * (c2 - c1 + 1);
                        if (area > best && sum[r2 + 1][c2 + 1] - sum[r1][c2 + 1] - sum[r2 + 1][c1] + sum[r1][c1] == area) best = area;
                    }
        return best;
    }
};
