class Solution {
public:
    int countTwinStrands(string dna, int len) {
        const int n = static_cast<int>(dna.size());
        set<string> once, twice;
        for (int i = 0; i + len < n; ++i) {  // Bug: should be i + len <= n; the final window is never looked at.
            const string s = dna.substr(i, len);
            if (!once.insert(s).second) twice.insert(s);
        }
        return static_cast<int>(twice.size());
    }
};
