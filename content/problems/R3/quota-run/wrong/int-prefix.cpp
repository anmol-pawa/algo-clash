class Solution {
public:
    int shortestQuota(vector<int> change, long long quota) {
        const int n = static_cast<int>(change.size());
        vector<int> prefix(n + 1, 0);  // bug: prefix sums reach 10^10 and overflow int
        for (int i = 0; i < n; ++i) prefix[i + 1] = prefix[i] + change[i];
        int best = n + 1;
        deque<int> starts;
        for (int end = 0; end <= n; ++end) {
            while (!starts.empty() && prefix[end] - prefix[starts.front()] >= quota) {
                best = min(best, end - starts.front());
                starts.pop_front();
            }
            while (!starts.empty() && prefix[starts.back()] >= prefix[end]) starts.pop_back();
            starts.push_back(end);
        }
        return best > n ? -1 : best;
    }
};
