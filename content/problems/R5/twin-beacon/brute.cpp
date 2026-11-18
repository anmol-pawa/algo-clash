class Solution {
public:
    int findTwin(vector<int>& beacons) {
        vector<int> sorted(beacons);
        sort(sorted.begin(), sorted.end());
        for (size_t i = 1; i < sorted.size(); ++i)
            if (sorted[i] == sorted[i - 1]) return sorted[i];
        return -1;
    }
};
