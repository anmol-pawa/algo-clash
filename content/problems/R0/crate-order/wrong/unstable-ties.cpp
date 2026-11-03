class Solution {
public:
    vector<int> rankCrates(vector<int>& weights) {
        // Wrong: sorts the numbers by weight only. std::sort is not stable, so crates of equal weight can come out in any order.
        vector<int> order(weights.size());
        iota(order.begin(), order.end(), 0);
        sort(order.begin(), order.end(), [&](int a, int b) { return weights[a] > weights[b]; });
        return order;
    }
};
