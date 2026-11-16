class Solution {
public:
    int brightestPane(const vector<string>& wall) {
        // Bug: the classic largest-square DP answers a different question.
        const int rows = static_cast<int>(wall.size());
        const int cols = static_cast<int>(wall[0].size());
        vector<vector<int>> side(rows + 1, vector<int>(cols + 1, 0));
        int best = 0;
        for (int r = 1; r <= rows; ++r)
            for (int c = 1; c <= cols; ++c)
                if (wall[r - 1][c - 1] == '1') {
                    side[r][c] = 1 + min({side[r - 1][c], side[r][c - 1], side[r - 1][c - 1]});
                    best = max(best, side[r][c] * side[r][c]);
                }
        return best;
    }
};
