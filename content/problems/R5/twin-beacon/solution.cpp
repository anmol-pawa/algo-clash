class Solution {
public:
    int findTwin(vector<int>& beacons) {
        // View index i as a node whose next pointer is beacons[i]. Every value is in 1..n and
        // there are n + 1 indices, so index 0 (nobody points to it) leads into a cycle, and the
        // cycle entry is the value that two different indices point to: the duplicate.
        int slow = beacons[0];
        int fast = beacons[beacons[0]];
        while (slow != fast) {  // phase 1: meet somewhere inside the cycle
            slow = beacons[slow];
            fast = beacons[beacons[fast]];
        }
        slow = 0;  // phase 2: a walker from the start meets the other at the cycle entry
        while (slow != fast) {
            slow = beacons[slow];
            fast = beacons[fast];
        }
        return slow;
    }
};
