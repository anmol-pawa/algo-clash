class Solution {
public:
    string smallestSeal(string code, int k) {
        // Try every way to keep n-k digits (n is small in the stress tests), compare as numbers.
        const int n = static_cast<int>(code.size());
        const int keep = n - k;
        string best;
        bool have = false;
        for (int mask = 0; mask < (1 << n); ++mask) {
            if (__builtin_popcount(mask) != keep) continue;
            string s;
            for (int i = 0; i < n; ++i) {
                if (mask >> i & 1) s += code[i];
            }
            const size_t nz = s.find_first_not_of('0');
            s = nz == string::npos ? "0" : s.substr(nz);
            if (!have || s.size() < best.size() || (s.size() == best.size() && s < best)) {
                best = s;
                have = true;
            }
        }
        return have ? best : "0";
    }
};
