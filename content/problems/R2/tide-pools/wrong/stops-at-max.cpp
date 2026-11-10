class Solution {
public:
    long long poolVolume(vector<int> heights) {
        const int n = static_cast<int>(heights.size());
        long long water = 0;
        int i = 0;
        // Wrong: fills only between a wall and the next wall at least as tall, then stops at the global peak.
        while (i < n) {
            int j = i + 1;
            while (j < n && heights[j] < heights[i]) ++j;
            if (j == n) break;
            for (int k = i + 1; k < j; ++k) water += heights[i] - heights[k];
            i = j;
        }
        return water;
    }
};
