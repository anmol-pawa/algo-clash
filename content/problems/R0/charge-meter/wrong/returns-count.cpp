class Solution {
public:
    int triggerIndex(vector<int> readings, long long limit) {
        // Wrong: returns how many ticks it took (index + 1) instead of the index.
        long long charge = 0;
        for (int i = 0; i < static_cast<int>(readings.size()); ++i) {
            if (readings[i] < 0) continue;
            charge += readings[i];
            if (charge >= limit) return i + 1;
        }
        return -1;
    }
};
