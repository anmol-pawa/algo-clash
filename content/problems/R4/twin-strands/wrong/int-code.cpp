class Solution {
public:
    int countTwinStrands(string dna, int len) {
        const int n = static_cast<int>(dna.size());
        if (n < len) return 0;
        const unsigned mask = len >= 16 ? 0xFFFFFFFFu : (1u << (2 * len)) - 1;  // Bug: 32-bit code, so long strands collide.
        unordered_map<unsigned, int> seen;
        unsigned code = 0;
        int twins = 0;
        for (int i = 0; i < n; ++i) {
            const unsigned letter = dna[i] == 'A' ? 0 : dna[i] == 'C' ? 1 : dna[i] == 'G' ? 2 : 3;
            code = ((code << 2) | letter) & mask;
            if (i + 1 < len) continue;
            if (++seen[code] == 2) ++twins;
        }
        return twins;
    }
};
