class Solution {
public:
    long long bestBasin(vector<int> heights) {
        int left = 0, right = static_cast<int>(heights.size()) - 1;
        long long best = 0;
        while (left < right) {
            best = max(best, static_cast<long long>(right - left + 1) * min(heights[left], heights[right]));  // Wrong: width is the gap, not the count of posts.
            if (heights[left] < heights[right]) ++left;
            else --right;
        }
        return best;
    }
};
