class Solution {
public:
    long long cisternVolume(const vector<int>& ridge) {
        const int n = static_cast<int>(ridge.size());
        int total = 0;  // Bug: the sum can pass 2^31 on a long, deep basin.
        vector<int> stack;
        for (int i = 0; i < n; ++i) {
            while (!stack.empty() && ridge[stack.back()] < ridge[i]) {
                const int floorIdx = stack.back();
                stack.pop_back();
                if (stack.empty()) break;
                const int left = stack.back();
                total += (i - left - 1) * (min(ridge[left], ridge[i]) - ridge[floorIdx]);
            }
            stack.push_back(i);
        }
        return total;
    }
};
