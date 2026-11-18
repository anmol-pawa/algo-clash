class Solution {
public:
    int findTwin(vector<int>& beacons) {
        // Wrong: stops after phase 1 and returns the meeting point, which is somewhere inside the cycle,
        // not necessarily its entry.
        int slow = beacons[0];
        int fast = beacons[beacons[0]];
        while (slow != fast) {
            slow = beacons[slow];
            fast = beacons[beacons[fast]];
        }
        return slow;
    }
};
