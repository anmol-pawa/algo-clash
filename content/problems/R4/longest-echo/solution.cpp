class Solution {
public:
    string longestEcho(string strand) {
        const int n = static_cast<int>(strand.size());
        int lo = 0, hi = n;  // invariant: an echo of length lo exists (0 trivially); none of length hi exists
        int bestStart = -1;
        while (hi - lo > 1) {
            const int mid = lo + (hi - lo) / 2;
            const int start = firstRepeat(strand, mid);
            if (start >= 0) { lo = mid; bestStart = start; }  // length mid repeats: try longer
            else hi = mid;                                    // it does not: no longer length can
        }
        return lo == 0 ? string() : strand.substr(bestStart, lo);
    }

private:
    static constexpr long long M1 = 1000000007LL, M2 = 998244353LL, B1 = 911382323LL % M1, B2 = 972663749LL % M2;

    // Start of the earliest block of length len that already occurred before, or -1.
    static int firstRepeat(const string& s, int len) {
        const int n = static_cast<int>(s.size());
        long long h1 = 0, h2 = 0, p1 = 1, p2 = 1;  // p = B^len, used to drop the outgoing letter
        for (int i = 0; i < len; ++i) { p1 = p1 * B1 % M1; p2 = p2 * B2 % M2; }
        unordered_map<long long, int> firstSeen;  // packed hash pair -> earliest start
        firstSeen.reserve(n * 2);
        for (int i = 0; i < n; ++i) {
            h1 = (h1 * B1 + (s[i] - 'a' + 1)) % M1;
            h2 = (h2 * B2 + (s[i] - 'a' + 1)) % M2;
            if (i >= len) {  // remove s[i - len]
                h1 = ((h1 - (s[i - len] - 'a' + 1) * p1) % M1 + M1) % M1;
                h2 = ((h2 - (s[i - len] - 'a' + 1) * p2) % M2 + M2) % M2;
            }
            if (i < len - 1) continue;
            const int start = i - len + 1;
            const long long key = h1 * M2 + h2;  // < 1e9 * 1e9 + 1e9, fits in 63 bits
            const auto it = firstSeen.find(key);
            if (it == firstSeen.end()) firstSeen.emplace(key, start);
            else if (s.compare(it->second, len, s, start, len) == 0) return start;  // verify: hashes can collide
        }
        return -1;
    }
};
