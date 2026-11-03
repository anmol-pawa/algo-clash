class Solution {
    // const& means "read it, do not copy it": a copy per query would cost O(n) each.
    static int countOne(const vector<int>& shelves, int h) {
        return static_cast<int>(lower_bound(shelves.begin(), shelves.end(), h) - shelves.begin());
    }

public:
    vector<int> countBelow(const vector<int>& shelves, const vector<int>& queries) {
        vector<int> answer;
        answer.reserve(queries.size());
        for (const int h : queries) answer.push_back(countOne(shelves, h));
        return answer;
    }
};
