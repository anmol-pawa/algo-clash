class Solution {
public:
    int shortestQuota(vector<int> change, long long quota) {
        const int n = static_cast<int>(change.size());
        vector<long long> prefix(n + 1, 0);  // prefix[i] = sum of the first i days
        for (int i = 0; i < n; ++i) prefix[i + 1] = prefix[i] + change[i];
        int best = n + 1;  // n + 1 means "no run reaches the quota"
        deque<int> starts;  // indices with strictly increasing prefix values: the only useful run starts
        for (int end = 0; end <= n; ++end) {
            // The oldest start that reaches the quota is the shortest run ending here. After using it, any
            // later end is farther away, so this start can never give a shorter run: drop it.
            while (!starts.empty() && prefix[end] - prefix[starts.front()] >= quota) {
                best = min(best, end - starts.front());
                starts.pop_front();
            }
            // A start with a prefix not smaller than prefix[end] is beaten by `end`: it is older (longer runs)
            // and has a bigger prefix (smaller sums), so it can never win. Drop it.
            while (!starts.empty() && prefix[starts.back()] >= prefix[end]) starts.pop_back();
            starts.push_back(end);
        }
        return best > n ? -1 : best;
    }
};
