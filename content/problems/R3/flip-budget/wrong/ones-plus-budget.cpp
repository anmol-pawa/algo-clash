class Solution {
public:
    int longestAfterFlips(vector<int> lamps, int budget) {
        // wrong: ignores where the ones are; flipped zeros must make a single run
        int ones = 0;
        for (int v : lamps) ones += v;
        return min(static_cast<int>(lamps.size()), ones + budget);
    }
};
