class Solution {
public:
    int findTwin(vector<int>& beacons) {
        // Wrong (too slow): compare every pair. O(n^2).
        const int len = static_cast<int>(beacons.size());
        for (int i = 0; i < len; ++i)
            for (int j = i + 1; j < len; ++j)
                if (beacons[i] == beacons[j]) return beacons[i];
        return -1;
    }
};
