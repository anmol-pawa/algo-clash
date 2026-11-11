class Solution {
public:
    vector<string> echoes(string strand, int k) {
        // Wrong: only counts a repeat if the two occurrences do not overlap.
        const int n = static_cast<int>(strand.size());
        map<string, int> lastEnd;
        set<string> found;
        for (int i = 0; i + k <= n; ++i) {
            const string block = strand.substr(i, k);
            const auto it = lastEnd.find(block);
            if (it != lastEnd.end() && it->second <= i) found.insert(block);
            if (it == lastEnd.end()) lastEnd[block] = i + k;
        }
        return vector<string>(found.begin(), found.end());
    }
};
