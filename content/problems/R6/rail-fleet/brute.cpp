class Solution {
public:
    int countConvoys(int depot, vector<int>& start, vector<int>& speed) {
        const int n = static_cast<int>(start.size());
        int convoys = 0;
        // A train leads a convoy exactly when it arrives strictly later than every train ahead of it.
        for (int i = 0; i < n; ++i) {
            bool leads = true;
            const long long di = depot - start[i];
            for (int j = 0; j < n && leads; ++j) {
                if (start[j] <= start[i]) continue;
                const long long dj = depot - start[j];
                if (!(di * speed[j] > dj * speed[i])) leads = false;
            }
            if (leads) ++convoys;
        }
        return convoys;
    }
};
