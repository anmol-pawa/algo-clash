class Solution {
public:
    int minFerries(vector<int> weights, int limit) {
        sort(weights.begin(), weights.end());
        int light = 0, heavy = static_cast<int>(weights.size()) - 1;
        int ferries = 0;
        while (light <= heavy) {
            if (weights[light] + weights[heavy] <= limit || light == heavy) { ++light; --heavy; }
            else { ++light; }  // Wrong: the light rider is dropped without a ferry when the pair does not fit.
            ++ferries;
        }
        return ferries;
    }
};
