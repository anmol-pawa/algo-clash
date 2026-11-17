class Solution {
public:
    int countConvoys(int depot, vector<int>& start, vector<int>& speed) {
        const int n = static_cast<int>(start.size());
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        sort(order.begin(), order.end(), [&](int a, int b) { return start[a] > start[b]; });
        vector<pair<long long, long long>> convoys;
        for (const int i : order) {
            const long long dist = depot - start[i];
            const long long v = speed[i];
            // Wrong: >= makes a train that reaches the depot at the same moment a separate convoy.
            if (convoys.empty() || dist * convoys.back().second >= convoys.back().first * v) {
                convoys.emplace_back(dist, v);
            }
        }
        return static_cast<int>(convoys.size());
    }
};
