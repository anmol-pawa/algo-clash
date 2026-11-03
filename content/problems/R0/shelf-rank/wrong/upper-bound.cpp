class Solution {
public:
    vector<int> countBelow(const vector<int>& shelves, const vector<int>& queries) {
        // Wrong: upper_bound counts shelves lower than OR EQUAL to the query.
        vector<int> answer;
        for (const int h : queries) {
            answer.push_back(static_cast<int>(upper_bound(shelves.begin(), shelves.end(), h) - shelves.begin()));
        }
        return answer;
    }
};
