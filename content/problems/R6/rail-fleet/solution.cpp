class Solution {
public:
    int countConvoys(int depot, vector<int>& start, vector<int>& speed) {
        const int n = static_cast<int>(start.size());
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        // Front of the line first: nearest to the depot.
        sort(order.begin(), order.end(), [&](int a, int b) { return start[a] > start[b]; });

        // Each convoy is (remaining distance, speed) of its lead train. Times strictly increase up the stack.
        vector<pair<long long, long long>> convoys;
        for (const int i : order) {
            const long long dist = depot - start[i];
            const long long v = speed[i];
            // dist / v > topDist / topV, compared without division. A tie merges at the depot.
            if (convoys.empty() || dist * convoys.back().second > convoys.back().first * v) {
                convoys.emplace_back(dist, v);
            }
        }
        return static_cast<int>(convoys.size());
    }
};
