class Solution {
public:
    vector<int> waitDays(vector<int>& temps) {
        const int n = static_cast<int>(temps.size());
        vector<int> wait(n, 0);
        vector<int> pending;
        for (int i = 0; i < n; ++i) {
            // Wrong: <= treats an equal reading as "hotter".
            while (!pending.empty() && temps[pending.back()] <= temps[i]) {
                wait[pending.back()] = i - pending.back();
                pending.pop_back();
            }
            pending.push_back(i);
        }
        return wait;
    }
};
