class Solution {
public:
    vector<int> squashRuns(vector<int> nums) {
        // Wrong: removes every repeated label, not only repeats in the same run.
        set<int> seen;
        vector<int> out;
        for (const int x : nums) {
            if (seen.insert(x).second) out.push_back(x);
        }
        return out;
    }
};
