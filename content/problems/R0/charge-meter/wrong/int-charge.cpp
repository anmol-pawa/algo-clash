class Solution {
public:
    int triggerIndex(vector<int> readings, long long limit) {
        // Wrong: a 32-bit charge overflows once readings are large.
        int charge = 0;
        for (int i = 0; i < static_cast<int>(readings.size()); ++i) {
            if (readings[i] < 0) continue;
            charge += readings[i];
            if (charge >= limit) return i;
        }
        return -1;
    }
};
