class Solution {
public:
    vector<int> countBelow(const vector<int>& shelves, const vector<int>& queries) {
        // Count by scanning every shelf for every query; no sortedness assumed.
        vector<int> answer;
        for (size_t j = 0; j < queries.size(); ++j) {
            int count = 0;
            for (size_t i = 0; i < shelves.size(); ++i) {
                if (shelves[i] < queries[j]) ++count;
            }
            answer.push_back(count);
        }
        return answer;
    }
};
