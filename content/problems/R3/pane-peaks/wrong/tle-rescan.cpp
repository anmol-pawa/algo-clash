class Solution {
public:
    vector<int> paneMaxima(vector<int> heat, int width) {
        const int n = static_cast<int>(heat.size());
        vector<int> answer;
        for (int start = 0; start + width <= n; ++start) {  // correct but O(n * width): rescans every frame
            int best = INT_MIN;
            for (int j = start; j < start + width; ++j) {
                if (heat[j] > best) best = heat[j];
            }
            answer.push_back(best);
        }
        return answer;
    }
};
