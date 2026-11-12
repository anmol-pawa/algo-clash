class Solution {
public:
    int countConvoys(int depot, vector<int>& start, vector<int>& speed) {
        const int n = static_cast<int>(start.size());
        vector<int> order(n);
        iota(order.begin(), order.end(), 0);
        sort(order.begin(), order.end(), [&](int a, int b) { return start[a] > start[b]; });
        int convoys = 0;
        int headDist = 0, headSpeed = 1;
        for (const int i : order) {
            const int dist = depot - start[i];
            // Wrong: the products reach 10^15 and overflow a 32-bit int.
            if (convoys == 0 || dist * headSpeed > headDist * speed[i]) {
                ++convoys;
                headDist = dist;
                headSpeed = speed[i];
            }
        }
        return convoys;
    }
};
