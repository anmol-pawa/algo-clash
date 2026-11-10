class Solution {
public:
    vector<long long> stretchTotals(vector<int> coins, vector<vector<int>> queries) {
        vector<long long> answers;
        for (const auto& q : queries) {
            long long sum = 0;
            for (int i = q[0]; i <= q[1]; ++i) sum += coins[i];  // Wrong: O(n) per query.
            answers.push_back(sum);
        }
        return answers;
    }
};
