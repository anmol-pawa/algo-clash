class Solution {
public:
    vector<int> paneMaxima(vector<int> heat, int width) {
        const int n = static_cast<int>(heat.size());
        vector<int> answer;
        deque<int> window;
        for (int i = 0; i < n; ++i) {
            while (!window.empty() && heat[window.back()] <= heat[i]) window.pop_back();
            window.push_back(i);
            // bug: never drops a front index that has slid out of the frame
            if (i >= width - 1) answer.push_back(heat[window.front()]);
        }
        return answer;
    }
};
