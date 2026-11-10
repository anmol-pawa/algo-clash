class Solution {
public:
    int minFerries(vector<int> weights, int limit) {
        sort(weights.begin(), weights.end());
        int ferries = 0;
        int i = 0;
        const int n = static_cast<int>(weights.size());
        while (i < n) {
            long long load = 0;
            int onBoard = 0;
            while (i < n && load + weights[i] <= limit) { load += weights[i++]; ++onBoard; }  // Wrong: ignores the two-rider cap.
            if (onBoard == 0) ++i;
            ++ferries;
        }
        return ferries;
    }
};
