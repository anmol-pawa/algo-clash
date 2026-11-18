class Solution {
public:
    int findTwin(vector<int>& beacons) {
        // Wrong: assumes the repeated value appears exactly twice, so
        // (sum of readings) - (1 + ... + n) is the duplicate. With three or more copies it is not.
        long long n = static_cast<long long>(beacons.size()) - 1;
        long long sum = 0;
        for (int b : beacons) sum += b;
        return static_cast<int>(sum - n * (n + 1) / 2);
    }
};
