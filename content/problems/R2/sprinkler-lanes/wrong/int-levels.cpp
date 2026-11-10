class Solution {
public:
    vector<long long> finalLevels(int lanes, vector<vector<int>> jobs) {
        vector<int> delta(lanes + 1, 0);  // Wrong: levels reach 10^14 and overflow int.
        for (const auto& job : jobs) {
            delta[job[0]] += job[2];
            delta[job[1] + 1] -= job[2];
        }
        vector<long long> level(lanes);
        int running = 0;
        for (int i = 0; i < lanes; ++i) {
            running += delta[i];
            level[i] = running;
        }
        return level;
    }
};
