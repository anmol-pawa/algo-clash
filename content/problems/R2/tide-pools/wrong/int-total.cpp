class Solution {
public:
    long long poolVolume(vector<int> heights) {
        int left = 0, right = static_cast<int>(heights.size()) - 1;
        int leftWall = 0, rightWall = 0;
        int water = 0;  // Wrong: the total reaches 10^10 and overflows int.
        while (left < right) {
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
