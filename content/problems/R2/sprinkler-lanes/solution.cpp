class Solution {
public:
    vector<long long> finalLevels(int lanes, vector<vector<int>> jobs) {
        // delta[i] = change in level between lane i-1 and lane i. A job adds v at l and takes it back after r.
        vector<long long> delta(lanes + 1, 0);
        for (const auto& job : jobs) {
            delta[job[0]] += job[2];
            delta[job[1] + 1] -= job[2];
        }
        vector<long long> level(lanes);
        long long running = 0;
        for (int i = 0; i < lanes; ++i) {
            running += delta[i];
            level[i] = running;
        }
        return level;
    }
};
