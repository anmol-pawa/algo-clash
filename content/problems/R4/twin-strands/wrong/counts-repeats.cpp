class Solution {
public:
    int countTwinStrands(string dna, int len) {
        const int n = static_cast<int>(dna.size());
        if (n < len) return 0;
        const uint64_t mask = (1ULL << (2 * len)) - 1;
        unordered_map<uint64_t, int> seen;
        uint64_t code = 0;
        int twins = 0;
        for (int i = 0; i < n; ++i) {
            const uint64_t letter = dna[i] == 'A' ? 0 : dna[i] == 'C' ? 1 : dna[i] == 'G' ? 2 : 3;
            code = ((code << 2) | letter) & mask;
            if (i + 1 < len) continue;
            if (++seen[code] >= 2) ++twins;  // Bug: counts every repeat, not each pattern once.
        }
        return twins;
    }
};
