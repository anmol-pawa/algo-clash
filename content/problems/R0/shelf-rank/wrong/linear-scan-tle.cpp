class Solution {
public:
    vector<int> countBelow(const vector<int>& shelves, const vector<int>& queries) {
        // Wrong (too slow): ignores that the shelves are sorted, O(n * m) overall.
        vector<int> answer;
        for (const int h : queries) {
            int count = 0;
            for (const int s : shelves) {
                if (s < h) ++count;
            }
            answer.push_back(count);
        }
        return answer;
    }
};
