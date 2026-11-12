class Solution {
public:
    vector<int> daysToWarmer(vector<int>& forecast) {
        const int n = static_cast<int>(forecast.size());
        vector<int> wait(n, 0);
        // Days still waiting for a warmer day. Invariant: their temperatures never rise from bottom to top.
        vector<int> waiting;
        for (int day = 0; day < n; ++day) {
            while (!waiting.empty() && forecast[waiting.back()] < forecast[day]) {
                wait[waiting.back()] = day - waiting.back();
                waiting.pop_back();
            }
            waiting.push_back(day);
        }
        return wait;
    }
};
