class Solution {
public:
    bool hasEcho(vector<int> pings, int k) {
        unordered_set<int> seen;
        for (const int p : pings) {
            if (!seen.insert(p).second) return true;  // Wrong: any repeat counts, however far apart.
        }
        return false;
    }
};
