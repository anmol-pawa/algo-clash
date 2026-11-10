class Solution {
public:
    long long bestStretch(vector<int> gains) {
        long long positives = 0;
        int maxDay = gains[0];
        for (const int g : gains) {
            if (g > 0) positives += g;  // Wrong: ignores that the days must be consecutive.
            maxDay = max(maxDay, g);
        }
        return maxDay > 0 ? positives : maxDay;
    }
};
