class Solution {
    // Wrong (too slow): correct binary search, but the vector is taken BY VALUE, so every query copies all shelves.
    static int countOne(vector<int> shelves, int h) {
        return static_cast<int>(lower_bound(shelves.begin(), shelves.end(), h) - shelves.begin());
    }

public:
    vector<int> countBelow(const vector<int>& shelves, const vector<int>& queries) {
        vector<int> answer;
        for (const int h : queries) answer.push_back(countOne(shelves, h));
        return answer;
    }
};
