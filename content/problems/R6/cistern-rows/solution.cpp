class Solution {
public:
    long long cisternVolume(const vector<int>& ridge) {
        const int n = static_cast<int>(ridge.size());
        long long total = 0;
        vector<int> stack;  // indices of pillars with non-increasing heights: each one still waits for a right wall
        for (int i = 0; i < n; ++i) {
            while (!stack.empty() && ridge[stack.back()] < ridge[i]) {
                const int floorIdx = stack.back();
                stack.pop_back();
                if (stack.empty()) break;  // nothing on the left: this water spills away
                const int left = stack.back();
                const long long width = i - left - 1;
                const long long depth = min(ridge[left], ridge[i]) - ridge[floorIdx];
                total += width * depth;  // one horizontal layer of the basin
            }
            stack.push_back(i);
        }
        return total;
    }
};
