class Solution {
public:
    int minFerries(vector<int> weights, int limit) {
        sort(weights.begin(), weights.end());
        int light = 0, heavy = static_cast<int>(weights.size()) - 1;
        int ferries = 0;
        while (light <= heavy) {
            // The heaviest remaining rider leaves now; the lightest joins if (and only if) they fit together.
            if (light < heavy && weights[light] + weights[heavy] <= limit) ++light;
            --heavy;
            ++ferries;
        }
        return ferries;
    }
};
