class Solution {
public:
    int valleyTally(vector<int>& depths) {
        const int n = static_cast<int>(depths.size());
        long long total = 0;
        for (int a = 0; a < n; ++a) {
            for (int b = a; b < n; ++b) {
                int low = depths[a];
                for (int k = a; k <= b; ++k) low = min(low, depths[k]);
                total = (total + low) % 1'000'000'007;
            }
        }
        return static_cast<int>(total);
    }
};
