class Solution {
public:
    string longestEcho(string strand) {
        // Wrong: hash mod 2^64 (natural overflow) and no verification. A Thue-Morse strand makes two different blocks collide.
        const int n = static_cast<int>(strand.size());
        int lo = 0, hi = n, bestStart = -1;
        while (hi - lo > 1) {
            const int mid = lo + (hi - lo) / 2;
            const int start = firstRepeat(strand, mid);
            if (start >= 0) { lo = mid; bestStart = start; } else hi = mid;
        }
        return lo == 0 ? string() : strand.substr(bestStart, lo);
    }

private:
    static int firstRepeat(const string& s, int len) {
        const int n = static_cast<int>(s.size());
        const unsigned long long B = 131;
        unsigned long long h = 0, p = 1;
        for (int i = 0; i < len; ++i) p *= B;
        unordered_set<unsigned long long> seen;
        for (int i = 0; i < n; ++i) {
            h = h * B + (s[i] - 'a' + 1);
            if (i >= len) h -= (s[i - len] - 'a' + 1) * p;
            if (i < len - 1) continue;
            if (!seen.insert(h).second) return i - len + 1;
        }
        return -1;
    }
};
