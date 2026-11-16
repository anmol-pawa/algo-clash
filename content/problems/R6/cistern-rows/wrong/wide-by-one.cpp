class Solution {
public:
    long long cisternVolume(const vector<int>& ridge) {
        const int n = static_cast<int>(ridge.size());
        long long total = 0;
        vector<int> stack;
        for (int i = 0; i < n; ++i) {
            while (!stack.empty() && ridge[stack.back()] < ridge[i]) {
                const int floorIdx = stack.back();
                stack.pop_back();
                if (stack.empty()) break;
                const int left = stack.back();
                // Bug: width measured from the popped floor, not from the pillar below it on the stack.
                const long long width = i - floorIdx;
                total += width * (min(ridge[left], ridge[i]) - ridge[floorIdx]);
            }
            stack.push_back(i);
        }
        return total;
    }
};
