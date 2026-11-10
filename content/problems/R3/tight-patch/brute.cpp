class Solution {
public:
    int tightPatch(vector<int> power, long long need) {
        const int n = static_cast<int>(power.size());
        int best = 0;
        for (int i = 0; i < n; ++i) {
            long long sum = 0;
            for (int j = i; j < n; ++j) {
                sum += power[j];
                if (sum >= need) {
                    if (best == 0 || j - i + 1 < best) best = j - i + 1;
                    break;
                }
            }
        }
        return best;
    }
};
