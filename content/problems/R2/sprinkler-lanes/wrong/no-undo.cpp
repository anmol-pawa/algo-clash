class Solution {
public:
    vector<long long> finalLevels(int lanes, vector<vector<int>> jobs) {
        vector<long long> delta(lanes + 1, 0);
        for (const auto& job : jobs) delta[job[0]] += job[2];  // Wrong: the effect is never cancelled after r.
        vector<long long> level(lanes);
        long long running = 0;
        for (int i = 0; i < lanes; ++i) level[i] = (running += delta[i]);
        return level;
    }
};
