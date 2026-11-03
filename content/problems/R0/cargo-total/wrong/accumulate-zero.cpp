class Solution {
public:
    long long totalWeight(vector<int> w) {
        // Wrong: the init value 0 is an int, so accumulate adds in int and overflows (it needs 0LL).
        return accumulate(w.begin(), w.end(), 0);
    }
};
