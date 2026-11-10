class Solution {
public:
    long long bestBasin(vector<int> heights) {
        int left = 0, right = static_cast<int>(heights.size()) - 1;
        long long best = 0;
        while (left < right) {
            best = max(best, static_cast<long long>(right - left) * min(heights[left], heights[right]));
            if (heights[left] > heights[right]) ++left;  // Wrong: discards the taller wall.
            else --right;
        }
        return best;
    }
};
