class Solution {
public:
    vector<int> paneMaxima(vector<int> heat, int width) {
        const int n = static_cast<int>(heat.size());
        vector<int> answer;
        for (int start = 0; start + width <= n; ++start) {  // correct but O(n * width): rescans every frame
            int bestAt = start;  // tracks the index of the maximum, so the loop is a true dependency chain
            for (int j = start + 1; j < start + width; ++j) {
                if (heat[j] > heat[bestAt]) bestAt = j;
            }
            answer.push_back(heat[bestAt]);
        }
        return answer;
    }
};
