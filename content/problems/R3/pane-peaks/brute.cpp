class Solution {
public:
    vector<int> paneMaxima(vector<int> heat, int width) {
        const int n = static_cast<int>(heat.size());
        vector<int> answer;
        for (int start = 0; start + width <= n; ++start) {
            int best = heat[start];
            for (int j = start + 1; j < start + width; ++j) best = max(best, heat[j]);
            answer.push_back(best);
        }
        return answer;
    }
};
