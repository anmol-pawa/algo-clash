class Solution {
public:
    vector<int> daysToWarmer(vector<int>& forecast) {
        const int n = static_cast<int>(forecast.size());
        vector<int> wait(n, 0);
        vector<int> waiting;
        for (int day = 0; day < n; ++day) {
            // Wrong: a warm day can settle several waiting days, not just the top one.
            if (!waiting.empty() && forecast[waiting.back()] < forecast[day]) {
                wait[waiting.back()] = day - waiting.back();
                waiting.pop_back();
            }
            waiting.push_back(day);
        }
        return wait;
    }
};
