class Solution {
public:
    vector<long long> stretchTotals(vector<int> coins, vector<vector<int>> queries) {
        vector<int> prefix(coins.size() + 1, 0);  // Wrong: prefix totals reach 10^14 and overflow int.
        for (size_t i = 0; i < coins.size(); ++i) prefix[i + 1] = prefix[i] + coins[i];
        vector<long long> answers;
        for (const auto& q : queries) answers.push_back(prefix[q[1] + 1] - prefix[q[0]]);
        return answers;
    }
};
