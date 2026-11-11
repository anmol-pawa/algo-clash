class Solution {
public:
    int countTwinStrands(string dna, int len) {
        // Correct but quadratic: compare the strand at every start with every later start.
        const int n = static_cast<int>(dna.size());
        int twins = 0;
        vector<char> counted(max(0, n - len + 1), 0);
        for (int i = 0; i + len <= n; ++i) {
            if (counted[i]) continue;
            bool repeated = false;
            for (int j = i + 1; j + len <= n; ++j) {
                if (dna.compare(i, len, dna, j, len) == 0) {
                    repeated = true;
                    counted[j] = 1;
                }
            }
            if (repeated) ++twins;
        }
        return twins;
    }
};
