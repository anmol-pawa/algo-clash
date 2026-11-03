class Solution {
public:
    vector<int> squashRuns(vector<int> nums) {
        // std::unique shifts the kept elements to the front in one O(n) pass and returns the new end.
        // It only removes ADJACENT equal elements, which is exactly the rule here.
        nums.erase(unique(nums.begin(), nums.end()), nums.end());
        return nums;
    }
};
