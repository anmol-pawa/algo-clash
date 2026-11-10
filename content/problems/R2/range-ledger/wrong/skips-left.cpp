class Solution {
public:
    vector<long long> stretchTotals(vector<int> coins, vector<vector<int>> queries) {
        vector<long long> prefix(coins.size() + 1, 0);
        for (size_t i = 0; i < coins.size(); ++i) prefix[i + 1] = prefix[i] + coins[i];
        vector<long long> answers;
        for (const auto& q : queries) answers.push_back(prefix[q[1] + 1] - prefix[q[0] + 1]);  // Wrong: drops coins[l].
        return answers;
    }
};
