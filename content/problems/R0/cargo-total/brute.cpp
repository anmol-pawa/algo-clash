class Solution {
public:
    long long totalWeight(vector<int> w) {
        // Add the crates in a 128-bit sum (a GCC/clang extension, fine for a native check), then narrow.
        __int128 total = 0;
        for (size_t i = 0; i < w.size(); ++i) total += w[i];
        return static_cast<long long>(total);
    }
};
