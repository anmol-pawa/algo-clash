class Solution {
public:
    int triggerIndex(vector<int> readings, long long limit) {
        // Wrong: "at least" is >=, this needs to go strictly past the limit.
        long long charge = 0;
        for (int i = 0; i < static_cast<int>(readings.size()); ++i) {
            if (readings[i] < 0) continue;
            charge += readings[i];
            if (charge > limit) return i;
        }
        return -1;
    }
};
