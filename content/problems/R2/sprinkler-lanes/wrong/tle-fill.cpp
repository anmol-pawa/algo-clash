class Solution {
public:
    vector<long long> finalLevels(int lanes, vector<vector<int>> jobs) {
        vector<long long> level(lanes, 0);
        for (const auto& job : jobs)
            for (int i = job[0]; i <= job[1]; ++i) level[i] += job[2];  // Wrong: O(lanes) per job.
        return level;
    }
};
