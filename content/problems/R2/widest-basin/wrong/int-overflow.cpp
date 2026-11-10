class Solution {
public:
    long long bestBasin(vector<int> heights) {
        int left = 0, right = static_cast<int>(heights.size()) - 1;
        int best = 0;  // Wrong: width * height reaches 10^10 and overflows int.
        while (left < right) {
            best = max(best, (right - left) * min(heights[left], heights[right]));
            if (heights[left] < heights[right]) ++left;
            else --right;
        }
        return best;
    }
};
