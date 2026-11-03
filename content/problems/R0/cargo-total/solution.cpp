class Solution {
public:
    long long totalWeight(vector<int> w) {
        long long total = 0;  // 10^5 crates of 2 * 10^9 g do not fit in int
        for (const int x : w) total += x;
        return total;
    }
};
