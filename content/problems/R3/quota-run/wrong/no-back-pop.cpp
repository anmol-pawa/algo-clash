class Solution {
public:
    int shortestQuota(vector<int> change, long long quota) {
        const int n = static_cast<int>(change.size());
        vector<long long> prefix(n + 1, 0);
        for (int i = 0; i < n; ++i) prefix[i + 1] = prefix[i] + change[i];
        int best = n + 1;
        deque<int> starts;
        for (int end = 0; end <= n; ++end) {
            while (!starts.empty() && prefix[end] - prefix[starts.front()] >= quota) {
                best = min(best, end - starts.front());
                starts.pop_front();
            }
            starts.push_back(end);  // bug: never drops dominated starts, so a big prefix at the front hides later starts
        }
        return best > n ? -1 : best;
    }
};
