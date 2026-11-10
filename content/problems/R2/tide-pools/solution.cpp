class Solution {
public:
    long long poolVolume(vector<int> heights) {
        int left = 0, right = static_cast<int>(heights.size()) - 1;
        int leftWall = 0, rightWall = 0;  // tallest wall seen so far from each end
        long long water = 0;
        while (left < right) {
            // Whichever end is lower is bounded by its own side's tallest wall,
            // because the other side already has a wall at least that tall.
            if (heights[left] < heights[right]) {
                leftWall = max(leftWall, heights[left]);
                water += leftWall - heights[left];
                ++left;
            } else {
                rightWall = max(rightWall, heights[right]);
                water += rightWall - heights[right];
                --right;
            }
        }
        return water;
    }
};
