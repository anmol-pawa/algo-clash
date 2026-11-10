class Solution {
public:
    long long bestBasin(vector<int> heights) {
        int left = 0, right = static_cast<int>(heights.size()) - 1;
        long long best = 0;
        while (left < right) {
            const long long width = right - left;
            best = max(best, width * min(heights[left], heights[right]));
            // The shorter wall caps every basin it forms with anything closer, so it can never do better.
            if (heights[left] < heights[right]) ++left;
            else --right;
        }
        return best;
    }
};
