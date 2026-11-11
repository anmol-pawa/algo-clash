class Solution {
public:
    vector<int> paneMaxima(vector<int> heat, int width) {
        const int n = static_cast<int>(heat.size());
        vector<int> answer;
        deque<int> window;
        for (int i = 0; i < n; ++i) {
            while (!window.empty() && heat[window.back()] <= heat[i]) window.pop_back();
            window.push_back(i);
            if (window.front() <= i - width) window.pop_front();
            if (i >= width) answer.push_back(heat[window.front()]);  // bug: first frame ends at width - 1
        }
        return answer;
    }
};
