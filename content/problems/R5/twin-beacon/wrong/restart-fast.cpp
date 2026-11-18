class Solution {
public:
    int findTwin(vector<int>& beacons) {
        // Wrong: phase 2 moves the restarted walker two steps at a time instead of one.
        int slow = beacons[0];
        int fast = beacons[beacons[0]];
        while (slow != fast) {
            slow = beacons[slow];
            fast = beacons[beacons[fast]];
        }
        slow = 0;
        while (slow != fast) {
            slow = beacons[beacons[slow]];
            fast = beacons[fast];
            if (slow == fast) break;
        }
        return slow;
    }
};
