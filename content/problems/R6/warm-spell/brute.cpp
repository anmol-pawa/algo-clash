class Solution {
public:
    vector<int> daysToWarmer(vector<int>& forecast) {
        const int n = static_cast<int>(forecast.size());
        vector<int> wait(n, 0);
        // For every day, scan forward for the first strictly warmer day.
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                if (forecast[j] > forecast[i]) {
                    wait[i] = j - i;
                    break;
                }
            }
        }
        return wait;
    }
};
