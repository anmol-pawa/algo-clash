class Solution {
public:
    int valleyTally(vector<int>& depths) {
        // Correct but O(n^2): extend each stretch while carrying its running minimum.
        const int n = static_cast<int>(depths.size());
        long long total = 0;
        for (int a = 0; a < n; ++a) {
            int low = depths[a];
            for (int b = a; b < n; ++b) {
                low = min(low, depths[b]);
                total += low;
            }
            total %= 1'000'000'007;
        }
        return static_cast<int>(total);
    }
};
