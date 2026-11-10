class Solution {
public:
    long long poolVolume(vector<int> heights) {
        int wall = 0;
        long long water = 0;
        for (const int h : heights) {
            wall = max(wall, h);
            water += wall - h;  // Wrong: ignores the right side, so water spills over an open right end.
        }
        return water;
    }
};
