class Solution {
public:
    int countConvoys(int depot, vector<int>& start, vector<int>& speed) {
        // Wrong: counts distinct empty-track arrival times and ignores that a slow train ahead holds the rest up.
        set<pair<long long, long long>> times;
        for (size_t i = 0; i < start.size(); ++i) {
            const long long d = depot - start[i];
            const long long v = speed[i];
            const long long g = __gcd(d, v);
            times.insert({d / g, v / g});
        }
        return static_cast<int>(times.size());
    }
};
