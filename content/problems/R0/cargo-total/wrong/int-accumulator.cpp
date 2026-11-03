class Solution {
public:
    long long totalWeight(vector<int> w) {
        // Wrong: the sum is an int, so it overflows before it is widened on return.
        int total = 0;
        for (const int x : w) total += x;
        return total;
    }
};
