class Solution {
public:
    int triggerIndex(vector<int> readings, long long limit) {
        // Wrong: negative readings are added too, instead of skipped.
        long long charge = 0;
        for (int i = 0; i < static_cast<int>(readings.size()); ++i) {
            charge += readings[i];
            if (charge >= limit) return i;
        }
        return -1;
    }
};
