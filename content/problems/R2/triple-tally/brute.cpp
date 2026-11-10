class Solution {
public:
    int countTriples(vector<int> nums) {
        sort(nums.begin(), nums.end());
        set<array<int, 3>> found;
        const int n = static_cast<int>(nums.size());
        for (int i = 0; i < n; ++i)
            for (int j = i + 1; j < n; ++j)
                for (int k = j + 1; k < n; ++k)
                    if (nums[i] + nums[j] + nums[k] == 0) found.insert({nums[i], nums[j], nums[k]});
        return static_cast<int>(found.size());
    }
};
