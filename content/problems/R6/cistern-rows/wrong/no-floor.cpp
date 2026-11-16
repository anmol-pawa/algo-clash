class Solution {
public:
    long long cisternVolume(const vector<int>& ridge) {
        const int n = static_cast<int>(ridge.size());
        long long total = 0;
        vector<int> stack;
        for (int i = 0; i < n; ++i) {
            while (!stack.empty() && ridge[stack.back()] < ridge[i]) {
                stack.pop_back();
                if (stack.empty()) break;
                const int left = stack.back();
                // Bug: the stone floor is not subtracted, so layers of rock are counted as water.
                total += static_cast<long long>(i - left - 1) * min(ridge[left], ridge[i]);
            }
            stack.push_back(i);
        }
        return total;
    }
};
