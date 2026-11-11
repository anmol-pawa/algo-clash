class Solution {
public:
    string longestEcho(string strand) {
        // Wrong tie-break: among equally long echoes it returns the one whose FIRST occurrence is earliest,
        // not the one whose second occurrence starts earliest ("abcdcdab" must give "cd", this gives "ab").
        const int n = static_cast<int>(strand.size());
        int lo = 0, hi = n;
        while (hi - lo > 1) {
            const int mid = lo + (hi - lo) / 2;
            unordered_map<string, int> count;
            bool repeat = false;
            for (int i = 0; i + mid <= n && !repeat; ++i) repeat = ++count[strand.substr(i, mid)] >= 2;
            if (repeat) lo = mid; else hi = mid;
        }
        if (lo == 0) return "";
        unordered_map<string, int> count;
        for (int i = 0; i + lo <= n; ++i) ++count[strand.substr(i, lo)];
        for (int i = 0; i + lo <= n; ++i) if (count[strand.substr(i, lo)] >= 2) return strand.substr(i, lo);
        return "";
    }
};
