class Solution {
public:
    int triggerIndex(vector<int> readings, long long limit) {
        long long charge = 0;  // up to 10^5 * 10^9 = 10^14, so it must be 64-bit
        for (int i = 0; i < static_cast<int>(readings.size()); ++i) {
            if (readings[i] < 0) continue;  // noise: ignore and move on
            charge += readings[i];
            if (charge >= limit) return i;  // first tick that reaches the limit: stop looking
        }
        return -1;
    }
};
